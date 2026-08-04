const express = require('express');
const router = express.Router();
const { query } = require('../db/database');

// Get invitation data (public)
router.get('/invitations/:slugOrToken?', async (req, res) => {
  try {
    const { slugOrToken } = req.params;
    const { to, t } = req.query;

    let guest = null;

    if (slugOrToken) {
      // Try slug first, then token
      let result = await query(
        'SELECT g.*, gc.name as category_name FROM guests g LEFT JOIN guest_categories gc ON g.category_id = gc.id WHERE g.slug = $1',
        [slugOrToken]
      );
      if (result.rows.length === 0) {
        result = await query(
          'SELECT g.*, gc.name as category_name FROM guests g LEFT JOIN guest_categories gc ON g.category_id = gc.id WHERE g.invitation_token = $1',
          [slugOrToken]
        );
      }
      guest = result.rows[0] || null;
    } else if (t) {
      const result = await query(
        'SELECT g.*, gc.name as category_name FROM guests g LEFT JOIN guest_categories gc ON g.category_id = gc.id WHERE g.invitation_token = $1',
        [t]
      );
      guest = result.rows[0] || null;
    } else if (to) {
      const result = await query(
        'SELECT g.*, gc.name as category_name FROM guests g LEFT JOIN guest_categories gc ON g.category_id = gc.id WHERE g.name ILIKE $1',
        [`%${to}%`]
      );
      guest = result.rows[0] || null;
    }

    // If a specific guest was requested but not found, return 404
    if ((slugOrToken || t || to) && !guest) {
      return res.status(404).json({ message: 'Undangan tidak ditemukan' });
    }

    // Get RSVP for guest
    let rsvp = null;
    if (guest) {
      const rsvpResult = await query('SELECT * FROM rsvp WHERE guest_id = $1', [guest.id]);
      rsvp = rsvpResult.rows[0] || null;
    }

    // Get wedding data
    const settingsResult = await query('SELECT key, value FROM settings');
    const settings = {};
    settingsResult.rows.forEach(row => {
      settings[row.key] = row.value;
    });

    const groomResult = await query("SELECT * FROM couple WHERE type = 'groom'");
    const brideResult = await query("SELECT * FROM couple WHERE type = 'bride'");
    const couple = {
      groom: groomResult.rows[0] || null,
      bride: brideResult.rows[0] || null,
    };

    const eventsResult = await query('SELECT * FROM events ORDER BY event_date, start_time');
    const galleryResult = await query('SELECT * FROM gallery ORDER BY sort_order');
    const loveStoriesResult = await query('SELECT * FROM love_stories ORDER BY sort_order');
    const giftsResult = await query('SELECT * FROM gifts ORDER BY sort_order');

    // Get music from database (base64 data URL)
    let music = null;
    try {
      const musicDataResult = await query("SELECT value FROM settings WHERE key = 'music_data'");
      const musicNameResult = await query("SELECT value FROM settings WHERE key = 'music_filename'");
      const musicData = musicDataResult.rows[0]?.value || null;
      const filename = musicNameResult.rows[0]?.value || null;
      if (settings.music_enabled === '1' && musicData) {
        music = { url: musicData, filename };
      }
    } catch (e) {
      // Skip if music not found
    }

    // Content
    const content = {
      greeting: {
        opening: settings.greeting_opening || 'Bismillahirrahmanirrahim',
        quote: settings.greeting_quote || 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
        source: settings.greeting_source || 'QS. Ar-Rum: 21',
        closing: settings.greeting_closing || 'Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara pernikahan kami.',
      },
      closing: settings.closing_message || '',
      countdown_message: settings.countdown_message || 'Today is Our Special Day',
    };

    res.json({
      guest: guest ? { ...guest, rsvp, phone: undefined } : null,
      wedding: {
        couple,
        events: eventsResult.rows,
        gallery: galleryResult.rows,
        loveStories: loveStoriesResult.rows,
        gifts: giftsResult.rows,
        settings,
        content,
        music,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit RSVP
router.post('/rsvp', async (req, res) => {
  try {
    const { guest_id, attendance_status, pax, notes } = req.body;

    if (!guest_id || !attendance_status) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    // Check RSVP deadline
    const deadlineResult = await query("SELECT value FROM settings WHERE key = 'rsvp_deadline'");
    const deadline = deadlineResult.rows[0];
    if (deadline?.value && new Date(deadline.value) < new Date()) {
      return res.status(400).json({ message: 'Periode konfirmasi kehadiran telah berakhir.' });
    }

    // Validate guest
    const guestResult = await query('SELECT * FROM guests WHERE id = $1', [guest_id]);
    const guest = guestResult.rows[0];
    if (!guest) {
      return res.status(404).json({ message: 'Tamu tidak ditemukan' });
    }

    // Validate pax
    const actualPax = attendance_status === 'attending' ? Math.min(pax || 1, guest.max_pax) : 0;

    // Check existing RSVP
    const existingResult = await query('SELECT * FROM rsvp WHERE guest_id = $1', [guest_id]);
    if (existingResult.rows.length > 0) {
      return res.status(400).json({ message: 'RSVP sudah pernah dikirim. Gunakan endpoint update.' });
    }

    await query(
      'INSERT INTO rsvp (guest_id, attendance_status, pax, notes) VALUES ($1, $2, $3, $4)',
      [guest_id, attendance_status, actualPax, notes || '']
    );

    const rsvpResult = await query('SELECT * FROM rsvp WHERE guest_id = $1', [guest_id]);
    res.json({ rsvp: rsvpResult.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update RSVP
router.put('/rsvp/:guestId', async (req, res) => {
  try {
    const { guestId } = req.params;
    const { attendance_status, pax, notes } = req.body;

    // Check if updates allowed
    const allowResult = await query("SELECT value FROM settings WHERE key = 'rsvp_allow_update'");
    if (allowResult.rows[0]?.value !== '1') {
      return res.status(400).json({ message: 'Perubahan RSVP tidak diizinkan.' });
    }

    const guestResult = await query('SELECT * FROM guests WHERE id = $1', [guestId]);
    const guest = guestResult.rows[0];
    if (!guest) {
      return res.status(404).json({ message: 'Tamu tidak ditemukan' });
    }

    const actualPax = attendance_status === 'attending' ? Math.min(pax || 1, guest.max_pax) : 0;

    const existingResult = await query('SELECT * FROM rsvp WHERE guest_id = $1', [guestId]);
    if (existingResult.rows.length > 0) {
      await query(
        'UPDATE rsvp SET attendance_status = $1, pax = $2, notes = $3, updated_at = CURRENT_TIMESTAMP WHERE guest_id = $4',
        [attendance_status, actualPax, notes || '', guestId]
      );
    } else {
      await query(
        'INSERT INTO rsvp (guest_id, attendance_status, pax, notes) VALUES ($1, $2, $3, $4)',
        [guestId, attendance_status, actualPax, notes || '']
      );
    }

    const rsvpResult = await query('SELECT * FROM rsvp WHERE guest_id = $1', [guestId]);
    res.json({ rsvp: rsvpResult.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get wishes (public - only published)
router.get('/wishes', async (req, res) => {
  try {
    const result = await query(
      "SELECT id, name, message, created_at FROM wishes WHERE status = 'published' ORDER BY created_at DESC LIMIT 100"
    );
    res.json({ wishes: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit wish
router.post('/wishes', async (req, res) => {
  try {
    const { guest_id, name, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ message: 'Nama dan ucapan wajib diisi.' });
    }

    // Sanitize inputs
    const cleanName = name.trim().substring(0, 100);
    const cleanMessage = message.trim().substring(0, 500);

    // Check moderation setting
    const modResult = await query("SELECT value FROM settings WHERE key = 'wishes_moderation'");
    const status = modResult.rows[0]?.value === '1' ? 'pending' : 'published';

    await query(
      'INSERT INTO wishes (guest_id, name, message, status) VALUES ($1, $2, $3, $4)',
      [guest_id || null, cleanName, cleanMessage, status]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
