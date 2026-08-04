const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../db/database');
const { authMiddleware, JWT_SECRET } = require('../middleware/auth');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    try {
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    } catch (e) {
      // Serverless - skip
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${uuidv4().substring(0, 8)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedImage = ['.jpg', '.jpeg', '.png', '.webp'];
    const allowedAudio = ['.mp3'];
    const ext = path.extname(file.originalname).toLowerCase();
    if ([...allowedImage, ...allowedAudio].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  },
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password wajib diisi' });
    }

    const result = await query('SELECT * FROM admin_users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// All routes below require auth
router.use(authMiddleware);

// Dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const totalGuests = await query('SELECT COUNT(*) as count FROM guests');
    const rsvpResponded = await query('SELECT COUNT(*) as count FROM rsvp');
    const attending = await query("SELECT COUNT(*) as count FROM rsvp WHERE attendance_status = 'attending'");
    const notAttending = await query("SELECT COUNT(*) as count FROM rsvp WHERE attendance_status = 'not_attending'");
    const totalPax = await query("SELECT COALESCE(SUM(pax), 0) as total FROM rsvp WHERE attendance_status = 'attending'");
    const totalWishes = await query('SELECT COUNT(*) as count FROM wishes');

    const total_guests = parseInt(totalGuests.rows[0].count);
    const rsvp_responded = parseInt(rsvpResponded.rows[0].count);
    const pending_rsvp = total_guests - rsvp_responded;

    res.json({
      total_guests,
      rsvp_responded,
      attending: parseInt(attending.rows[0].count),
      not_attending: parseInt(notAttending.rows[0].count),
      total_pax: parseInt(totalPax.rows[0].total),
      pending_rsvp,
      total_wishes: parseInt(totalWishes.rows[0].count),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Categories
router.get('/categories', async (req, res) => {
  try {
    const result = await query('SELECT * FROM guest_categories ORDER BY name');
    res.json({ categories: result.rows });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Guests
router.get('/guests', async (req, res) => {
  try {
    const result = await query(`
      SELECT g.*, gc.name as category_name, r.attendance_status as rsvp_status, r.pax as rsvp_pax
      FROM guests g
      LEFT JOIN guest_categories gc ON g.category_id = gc.id
      LEFT JOIN rsvp r ON g.id = r.guest_id
      ORDER BY g.created_at DESC
    `);
    res.json({ guests: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/guests', async (req, res) => {
  try {
    const { name, phone, category_id, max_pax, notes, wa_type, invite_type } = req.body;

    if (!name) return res.status(400).json({ message: 'Nama wajib diisi' });

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const invitation_token = uuidv4().replace(/-/g, '').substring(0, 12);

    // Ensure slug is unique
    const existingSlug = await query('SELECT id FROM guests WHERE slug = $1', [slug]);
    const finalSlug = existingSlug.rows.length > 0 ? `${slug}-${Date.now().toString(36)}` : slug;

    await query(
      'INSERT INTO guests (name, slug, invitation_token, phone, category_id, max_pax, notes, wa_type, invite_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [name, finalSlug, invitation_token, phone || null, category_id || null, max_pax || 2, notes || null, wa_type || 'muslim', invite_type || 'partner']
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/guests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, category_id, max_pax, notes, wa_type, invite_type } = req.body;

    await query(
      'UPDATE guests SET name = $1, phone = $2, category_id = $3, max_pax = $4, notes = $5, wa_type = $6, invite_type = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8',
      [name, phone || null, category_id || null, max_pax || 2, notes || null, wa_type || 'muslim', invite_type || 'partner', id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/guests/:id', async (req, res) => {
  try {
    await query('DELETE FROM guests WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark WA as sent
router.put('/guests/:id/wa-sent', async (req, res) => {
  try {
    await query(
      'UPDATE guests SET wa_sent = TRUE, wa_sent_at = CURRENT_TIMESTAMP WHERE id = $1',
      [req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset WA sent flag
router.put('/guests/:id/wa-unsent', async (req, res) => {
  try {
    await query(
      'UPDATE guests SET wa_sent = FALSE, wa_sent_at = NULL WHERE id = $1',
      [req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Guest export
router.get('/guests/export', async (req, res) => {
  try {
    const result = await query(`
      SELECT g.name, g.phone, gc.name as category, g.max_pax, 
             r.attendance_status, r.pax, r.notes as rsvp_notes, r.submitted_at
      FROM guests g
      LEFT JOIN guest_categories gc ON g.category_id = gc.id
      LEFT JOIN rsvp r ON g.id = r.guest_id
      ORDER BY g.name
    `);

    let csv = 'Name,Phone,Category,Max Pax,RSVP Status,Pax,Notes,Submitted At\n';
    result.rows.forEach(g => {
      csv += `"${g.name}","${g.phone || ''}","${g.category || ''}",${g.max_pax},"${g.attendance_status || 'pending'}",${g.pax || 0},"${g.rsvp_notes || ''}","${g.submitted_at || ''}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=guests-export.csv');
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Guest import
router.post('/guests/import', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const content = fs.readFileSync(req.file.path, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());

    if (lines.length < 2) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'File kosong atau format salah' });
    }

    let imported = 0;

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim().replace(/"/g, ''));
      if (cols.length < 1 || !cols[0]) continue;

      const name = cols[0];
      const phone = cols[1] || null;
      const max_pax = parseInt(cols[3]) || 2;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36);
      const token = uuidv4().replace(/-/g, '').substring(0, 12);

      try {
        await query(
          'INSERT INTO guests (name, slug, invitation_token, phone, max_pax) VALUES ($1, $2, $3, $4, $5)',
          [name, slug, token, phone, max_pax]
        );
        imported++;
      } catch (e) {
        // Skip duplicates
      }
    }

    fs.unlinkSync(req.file.path);
    res.json({ success: true, imported });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// RSVP Management
router.get('/rsvp', async (req, res) => {
  try {
    const result = await query(`
      SELECT r.*, g.name as guest_name 
      FROM rsvp r 
      JOIN guests g ON r.guest_id = g.id 
      ORDER BY r.submitted_at DESC
    `);
    res.json({ rsvps: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/rsvp/:id', async (req, res) => {
  try {
    const { attendance_status, pax, notes } = req.body;
    await query(
      'UPDATE rsvp SET attendance_status = $1, pax = $2, notes = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4',
      [attendance_status, pax || 0, notes || '', req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Wishes Management
router.get('/wishes', async (req, res) => {
  try {
    const result = await query('SELECT * FROM wishes ORDER BY created_at DESC');
    res.json({ wishes: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/wishes/:id', async (req, res) => {
  try {
    const { status } = req.body;
    await query('UPDATE wishes SET status = $1 WHERE id = $2', [status, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/wishes/:id', async (req, res) => {
  try {
    await query('DELETE FROM wishes WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Couple Management
router.get('/couple', async (req, res) => {
  try {
    const groomResult = await query("SELECT * FROM couple WHERE type = 'groom'");
    const brideResult = await query("SELECT * FROM couple WHERE type = 'bride'");
    res.json({
      couple: {
        groom: groomResult.rows[0] || {},
        bride: brideResult.rows[0] || {},
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/couple', async (req, res) => {
  try {
    const { groom, bride } = req.body;

    const updateCouple = 'UPDATE couple SET full_name = $1, nickname = $2, father_name = $3, mother_name = $4, instagram = $5, child_order = $6, photo_focus = $7, photo_focuses = $8 WHERE type = $9';

    if (groom) await query(updateCouple, [groom.full_name, groom.nickname, groom.father_name, groom.mother_name, groom.instagram || null, groom.child_order || null, groom.photo_focus || 'center', groom.photo_focuses || '[]', 'groom']);
    if (bride) await query(updateCouple, [bride.full_name, bride.nickname, bride.father_name, bride.mother_name, bride.instagram || null, bride.child_order || null, bride.photo_focus || 'center', bride.photo_focuses || '[]', 'bride']);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/couple/photo', upload.single('photo'), async (req, res) => {
  try {
    const { type } = req.body;
    if (!req.file) return res.status(400).json({ message: 'No file' });

    const url = `/uploads/${req.file.filename}`;

    // Get existing photos array
    const existing = await query('SELECT photos FROM couple WHERE type = $1', [type]);
    let photos = [];
    try {
      photos = JSON.parse(existing.rows[0]?.photos || '[]');
    } catch (e) {
      photos = [];
    }
    photos.push(url);

    await query('UPDATE couple SET photo = $1, photos = $2 WHERE type = $3', [url, JSON.stringify(photos), type]);
    res.json({ url, photos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update photos array without file upload (for local/static images)
router.put('/couple/photo/update-array', async (req, res) => {
  try {
    const { type, photos, photo, photo_focuses } = req.body;
    await query(
      'UPDATE couple SET photo = $1, photos = $2, photo_focuses = $3 WHERE type = $4',
      [photo, JSON.stringify(photos), photo_focuses ? JSON.stringify(photo_focuses) : '[]', type]
    );
    res.json({ success: true, photos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/couple/photo', async (req, res) => {
  try {
    const { type, url } = req.body;

    const existing = await query('SELECT photos FROM couple WHERE type = $1', [type]);
    let photos = [];
    try {
      photos = JSON.parse(existing.rows[0]?.photos || '[]');
    } catch (e) {
      photos = [];
    }
    photos = photos.filter(p => p !== url);

    const mainPhoto = photos.length > 0 ? photos[0] : null;
    await query('UPDATE couple SET photo = $1, photos = $2 WHERE type = $3', [mainPhoto, JSON.stringify(photos), type]);

    // Delete file
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, '../../', url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.json({ success: true, photos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/couple/focus', async (req, res) => {
  try {
    const { type, photo_focus } = req.body;
    await query('UPDATE couple SET photo_focus = $1 WHERE type = $2', [photo_focus, type]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save per-photo crop settings (array of {x, y, scale})
router.put('/couple/focuses', async (req, res) => {
  try {
    const { type, photo_focuses } = req.body;
    await query('UPDATE couple SET photo_focuses = $1 WHERE type = $2', [photo_focuses, type]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Events Management
router.get('/events', async (req, res) => {
  try {
    const result = await query('SELECT * FROM events ORDER BY event_date, start_time');
    res.json({ events: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/events', async (req, res) => {
  try {
    const { title, event_date, start_time, end_time, venue, address, maps_url, is_main_event } = req.body;
    await query(
      'INSERT INTO events (title, event_date, start_time, end_time, venue, address, maps_url, is_main_event) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [title, event_date, start_time, end_time || null, venue, address || null, maps_url || null, is_main_event ? true : false]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/events/:id', async (req, res) => {
  try {
    const { title, event_date, start_time, end_time, venue, address, maps_url, is_main_event } = req.body;
    await query(
      'UPDATE events SET title = $1, event_date = $2, start_time = $3, end_time = $4, venue = $5, address = $6, maps_url = $7, is_main_event = $8 WHERE id = $9',
      [title, event_date, start_time, end_time || null, venue, address || null, maps_url || null, is_main_event ? true : false, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/events/:id', async (req, res) => {
  try {
    await query('DELETE FROM events WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Gallery Management
router.get('/gallery', async (req, res) => {
  try {
    const result = await query('SELECT * FROM gallery ORDER BY sort_order');
    res.json({ gallery: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/gallery', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file' });

    const image_url = `/uploads/${req.file.filename}`;
    const thumbnail_url = image_url;

    const maxOrder = await query('SELECT MAX(sort_order) as max FROM gallery');
    const sort_order = (parseInt(maxOrder.rows[0]?.max) || 0) + 1;

    await query(
      'INSERT INTO gallery (image_url, thumbnail_url, sort_order) VALUES ($1, $2, $3)',
      [image_url, thumbnail_url, sort_order]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/gallery/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM gallery WHERE id = $1', [req.params.id]);
    const photo = result.rows[0];
    if (photo) {
      const filePath = path.join(__dirname, '../../', photo.image_url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await query('DELETE FROM gallery WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/gallery/order', async (req, res) => {
  try {
    const { order } = req.body;
    for (const item of order) {
      await query('UPDATE gallery SET sort_order = $1 WHERE id = $2', [item.sort_order, item.id]);
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Love Stories
router.get('/love-stories', async (req, res) => {
  try {
    const result = await query('SELECT * FROM love_stories ORDER BY sort_order');
    res.json({ stories: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/love-stories', async (req, res) => {
  try {
    const { date, title, description } = req.body;
    const maxOrder = await query('SELECT MAX(sort_order) as max FROM love_stories');
    const sort_order = (parseInt(maxOrder.rows[0]?.max) || 0) + 1;
    await query(
      'INSERT INTO love_stories (date, title, description, sort_order) VALUES ($1, $2, $3, $4)',
      [date, title, description, sort_order]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/love-stories/:id', async (req, res) => {
  try {
    const { date, title, description } = req.body;
    await query(
      'UPDATE love_stories SET date = $1, title = $2, description = $3 WHERE id = $4',
      [date, title, description, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/love-stories/:id', async (req, res) => {
  try {
    await query('DELETE FROM love_stories WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Gifts
router.get('/gifts', async (req, res) => {
  try {
    const result = await query('SELECT * FROM gifts ORDER BY sort_order');
    res.json({ gifts: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/gifts', async (req, res) => {
  try {
    const { type, bank_name, account_number, account_holder, address } = req.body;
    const maxOrder = await query('SELECT MAX(sort_order) as max FROM gifts');
    const sort_order = (parseInt(maxOrder.rows[0]?.max) || 0) + 1;
    await query(
      'INSERT INTO gifts (type, bank_name, account_number, account_holder, address, sort_order) VALUES ($1, $2, $3, $4, $5, $6)',
      [type, bank_name || null, account_number || null, account_holder || null, address || null, sort_order]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/gifts/:id', async (req, res) => {
  try {
    const { type, bank_name, account_number, account_holder, address } = req.body;
    await query(
      'UPDATE gifts SET type = $1, bank_name = $2, account_number = $3, account_holder = $4, address = $5 WHERE id = $6',
      [type, bank_name || null, account_number || null, account_holder || null, address || null, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/gifts/:id', async (req, res) => {
  try {
    await query('DELETE FROM gifts WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Music
router.get('/music', async (req, res) => {
  try {
    const result = await query("SELECT value FROM settings WHERE key = 'music_enabled'");
    const uploadDir = path.join(__dirname, '../../uploads');
    const musicFiles = fs.existsSync(uploadDir) ? fs.readdirSync(uploadDir).filter(f => f.startsWith('music')) : [];
    const music = musicFiles.length > 0 ? { url: `/uploads/${musicFiles[0]}`, filename: musicFiles[0] } : null;
    res.json({ music, enabled: result.rows[0]?.value === '1' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/music', upload.single('music'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file' });

    // Remove old music files
    const uploadDir = path.join(__dirname, '../../uploads');
    const oldFiles = fs.readdirSync(uploadDir).filter(f => f.startsWith('music'));
    oldFiles.forEach(f => fs.unlinkSync(path.join(uploadDir, f)));

    // Rename with music prefix
    const newName = `music-${req.file.filename}`;
    fs.renameSync(req.file.path, path.join(uploadDir, newName));

    res.json({ success: true, url: `/uploads/${newName}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/music/toggle', async (req, res) => {
  try {
    const { enabled } = req.body;
    await query("UPDATE settings SET value = $1 WHERE key = 'music_enabled'", [enabled ? '1' : '0']);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Content
router.get('/content', async (req, res) => {
  try {
    const contentKeys = ['greeting_opening', 'greeting_quote', 'greeting_source', 'greeting_closing', 'closing_message', 'countdown_message'];
    const content = {};
    for (const key of contentKeys) {
      const result = await query('SELECT value FROM settings WHERE key = $1', [key]);
      content[key] = result.rows[0]?.value || '';
    }
    res.json({ content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/content', async (req, res) => {
  try {
    for (const [key, value] of Object.entries(req.body)) {
      await query(
        'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2',
        [key, value]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Settings
router.get('/settings', async (req, res) => {
  try {
    const result = await query('SELECT key, value FROM settings');
    const settings = {};
    result.rows.forEach(row => {
      settings[row.key] = row.value;
    });
    res.json({ settings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/settings', async (req, res) => {
  try {
    for (const [key, value] of Object.entries(req.body)) {
      await query(
        'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2',
        [key, value]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
