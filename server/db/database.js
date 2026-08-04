const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_K0bal6HvRxpw@ep-holy-dew-ays3pliz-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

function getDB() {
  return pool;
}

async function query(text, params) {
  const res = await pool.query(text, params);
  return res;
}

async function initDB() {
  // Ensure uploads directory exists (skip on serverless)
  try {
    const uploadsDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  } catch (e) {
    // Read-only filesystem (Vercel), skip
  }

  // Create tables
  await query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS guest_categories (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS guests (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE,
      invitation_token TEXT UNIQUE,
      phone TEXT,
      category_id INTEGER REFERENCES guest_categories(id) ON DELETE SET NULL,
      max_pax INTEGER DEFAULT 2,
      notes TEXT,
      wa_sent BOOLEAN DEFAULT FALSE,
      wa_sent_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Add wa_sent columns if not exist (migration for existing tables)
  await query(`ALTER TABLE guests ADD COLUMN IF NOT EXISTS wa_sent BOOLEAN DEFAULT FALSE`);
  await query(`ALTER TABLE guests ADD COLUMN IF NOT EXISTS wa_sent_at TIMESTAMP`);
  await query(`ALTER TABLE guests ADD COLUMN IF NOT EXISTS wa_type TEXT DEFAULT 'muslim'`);
  await query(`ALTER TABLE guests ADD COLUMN IF NOT EXISTS invite_type TEXT DEFAULT 'partner'`);
  await query(`ALTER TABLE couple ADD COLUMN IF NOT EXISTS child_order TEXT`);
  await query(`ALTER TABLE couple ADD COLUMN IF NOT EXISTS photos TEXT`);
  await query(`ALTER TABLE couple ADD COLUMN IF NOT EXISTS photo_focus TEXT DEFAULT 'center'`);
  await query(`ALTER TABLE couple ADD COLUMN IF NOT EXISTS photo_focuses TEXT DEFAULT '[]'`);

  await query(`
    CREATE TABLE IF NOT EXISTS rsvp (
      id SERIAL PRIMARY KEY,
      guest_id INTEGER UNIQUE REFERENCES guests(id) ON DELETE CASCADE,
      attendance_status TEXT CHECK(attendance_status IN ('attending', 'not_attending')),
      pax INTEGER DEFAULT 0,
      notes TEXT,
      submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS wishes (
      id SERIAL PRIMARY KEY,
      guest_id INTEGER REFERENCES guests(id) ON DELETE SET NULL,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'published' CHECK(status IN ('pending', 'published', 'hidden')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS couple (
      id SERIAL PRIMARY KEY,
      type TEXT CHECK(type IN ('groom', 'bride')),
      full_name TEXT,
      nickname TEXT,
      father_name TEXT,
      mother_name TEXT,
      photo TEXT,
      instagram TEXT
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      event_date TEXT,
      start_time TEXT,
      end_time TEXT,
      venue TEXT,
      address TEXT,
      maps_url TEXT,
      is_main_event BOOLEAN DEFAULT FALSE
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS gallery (
      id SERIAL PRIMARY KEY,
      image_url TEXT NOT NULL,
      thumbnail_url TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS love_stories (
      id SERIAL PRIMARY KEY,
      date TEXT,
      title TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      sort_order INTEGER DEFAULT 0
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS gifts (
      id SERIAL PRIMARY KEY,
      type TEXT CHECK(type IN ('bank', 'address')),
      bank_name TEXT,
      account_number TEXT,
      account_holder TEXT,
      address TEXT,
      sort_order INTEGER DEFAULT 0
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  // Insert default admin if not exists
  const bcrypt = require('bcryptjs');
  const { rows: existingAdmin } = await query('SELECT id FROM admin_users LIMIT 1');
  if (existingAdmin.length === 0) {
    const hash = bcrypt.hashSync('admin123', 10);
    await query('INSERT INTO admin_users (username, email, password_hash) VALUES ($1, $2, $3)', ['admin', 'admin@wedding.com', hash]);
  }

  // Insert default settings if not exists
  const defaultSettings = {
    wedding_title: 'The Wedding of Nauval & Pasangan',
    wedding_date: '2026-08-23',
    love_story_enabled: '1',
    gallery_enabled: '1',
    rsvp_enabled: '1',
    wishes_enabled: '1',
    gift_enabled: '1',
    music_enabled: '1',
    rsvp_deadline: '',
    rsvp_allow_update: '1',
    wishes_moderation: '0',
    hero_image: '',
  };

  for (const [key, value] of Object.entries(defaultSettings)) {
    await query('INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING', [key, value]);
  }

  // Insert default categories
  const { rows: existingCats } = await query('SELECT id FROM guest_categories LIMIT 1');
  if (existingCats.length === 0) {
    const cats = ['Family Groom', 'Family Bride', 'Friend Groom', 'Friend Bride', 'Office Groom', 'Office Bride', 'VIP Groom', 'VIP Bride', 'Other'];
    for (const c of cats) {
      await query('INSERT INTO guest_categories (name) VALUES ($1)', [c]);
    }
  } else {
    // Migration: rename and add new categories (idempotent)
    await query("UPDATE guest_categories SET name = 'Friend Groom' WHERE name = 'Friend'");
    await query("UPDATE guest_categories SET name = 'Office Groom' WHERE name = 'Office'");
    await query("UPDATE guest_categories SET name = 'VIP Groom' WHERE name = 'VIP'");
    
    // Insert only if not exists
    const newCats = ['Friend Bride', 'Office Bride', 'VIP Bride'];
    for (const cat of newCats) {
      const { rows } = await query("SELECT id FROM guest_categories WHERE name = $1", [cat]);
      if (rows.length === 0) await query("INSERT INTO guest_categories (name) VALUES ($1)", [cat]);
    }

    // Remove duplicates (keep lowest id)
    await query(`
      DELETE FROM guest_categories 
      WHERE id NOT IN (
        SELECT MIN(id) FROM guest_categories GROUP BY name
      )
    `);
  }

  // Insert default couple data
  const { rows: existingCouple } = await query('SELECT id FROM couple LIMIT 1');
  if (existingCouple.length === 0) {
    const defaultGroomPhotos = JSON.stringify(['/images/couple/groom/groom_1.JPEG', '/images/couple/groom/groom_2.JPEG']);
    await query(
      'INSERT INTO couple (type, full_name, nickname, father_name, mother_name, photo, photos) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      ['groom', 'Muhammad Nauval', 'Nauval', 'Ayah Nauval', 'Ibu Nauval', '/images/couple/groom/groom_1.JPEG', defaultGroomPhotos]
    );
    await query('INSERT INTO couple (type, full_name, nickname, father_name, mother_name) VALUES ($1, $2, $3, $4, $5)', ['bride', 'Nama Pasangan', 'Pasangan', 'Ayah Pasangan', 'Ibu Pasangan']);
  } else {
    // Migration: if groom has no photos set, populate with default local photos
    const { rows: groomRows } = await query("SELECT photos FROM couple WHERE type = 'groom'");
    if (groomRows.length > 0) {
      let groomPhotos = [];
      try { groomPhotos = JSON.parse(groomRows[0].photos || '[]'); } catch (e) {}
      if (groomPhotos.length === 0) {
        const defaultGroomPhotos = JSON.stringify(['/images/couple/groom/groom_1.JPEG', '/images/couple/groom/groom_2.JPEG']);
        await query(
          "UPDATE couple SET photo = '/images/couple/groom/groom_1.JPEG', photos = $1 WHERE type = 'groom'",
          [defaultGroomPhotos]
        );
      }
    }

    // Migration: if groom has no photos set, populate with default local photos
    const { rows: brideRows } = await query("SELECT photos FROM couple WHERE type = 'bride'");
    if (brideRows.length > 0) {
      let bridePhotos = [];
      try { bridePhotos = JSON.parse(brideRows[0].photos || '[]'); } catch (e) {}
      if (bridePhotos.length === 0) {
        const defaultBridePhotos = JSON.stringify(['/images/couple/bride/bride_1.JPEG', '/images/couple/bride/bride_2.JPEG']);
        await query(
          "UPDATE couple SET photo = '/images/couple/bride/bride_1.JPEG', photos = $1 WHERE type = 'bride'",
          [defaultBridePhotos]
        );
      }
    }
  }

  // Insert default event
  const { rows: existingEvent } = await query('SELECT id FROM events LIMIT 1');
  if (existingEvent.length === 0) {
    await query('INSERT INTO events (title, event_date, start_time, end_time, venue, address, maps_url, is_main_event) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', ['Akad Nikah', '2026-08-23', '08:00', '10:00', 'Masjid Agung', 'Jl. Merdeka No. 1', 'https://maps.google.com', true]);
    await query('INSERT INTO events (title, event_date, start_time, end_time, venue, address, maps_url, is_main_event) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', ['Wedding Reception', '2026-08-23', '11:00', '14:00', 'Gedung Serbaguna', 'Jl. Merdeka No. 2', 'https://maps.google.com', false]);
  }

  console.log('Database initialized (PostgreSQL - Neon)');
}

module.exports = { getDB, query, initDB };
