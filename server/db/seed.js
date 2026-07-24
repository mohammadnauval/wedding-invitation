/**
 * Seed script to populate database with sample data
 * Run: node server/db/seed.js
 */
require('dotenv').config();

const { initDB, query } = require('./database');
const { v4: uuidv4 } = require('uuid');

async function seed() {
  await initDB();
  console.log('Seeding database...');

  // Add sample guests
  const sampleGuests = [
    { name: 'Budi Santoso', phone: '081234567890', category_id: 3, max_pax: 2 },
    { name: 'Andi Prasetyo', phone: '082345678901', category_id: 4, max_pax: 1 },
    { name: 'Keluarga Santoso', phone: '083456789012', category_id: 1, max_pax: 4 },
    { name: 'Siti Aminah', phone: '084567890123', category_id: 2, max_pax: 2 },
    { name: 'Rudi Hartono', phone: '085678901234', category_id: 3, max_pax: 2 },
    { name: 'Dewi Lestari', phone: '086789012345', category_id: 5, max_pax: 2 },
    { name: 'Ahmad Fauzi', phone: '087890123456', category_id: 3, max_pax: 1 },
    { name: 'Putri Handayani', phone: '088901234567', category_id: 4, max_pax: 2 },
  ];

  let guestCount = 0;
  for (const g of sampleGuests) {
    const slug = g.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const token = uuidv4().replace(/-/g, '').substring(0, 12);
    try {
      await query(
        'INSERT INTO guests (name, slug, invitation_token, phone, category_id, max_pax) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (slug) DO NOTHING',
        [g.name, slug, token, g.phone, g.category_id, g.max_pax]
      );
      guestCount++;
    } catch (e) {
      // Skip if exists
    }
  }

  // Add sample love stories
  const stories = [
    { date: '2018', title: 'First Meet', description: 'Pertemuan pertama di acara kampus yang tidak akan pernah dilupakan.', sort_order: 1 },
    { date: '2020', title: 'Started Dating', description: 'Memulai hubungan setelah dua tahun berteman dekat.', sort_order: 2 },
    { date: '2025', title: 'Engagement', description: 'Lamaran yang penuh kejutan dan kebahagiaan.', sort_order: 3 },
    { date: '2026', title: 'Wedding', description: 'Hari dimana kami memulai perjalanan baru bersama.', sort_order: 4 },
  ];

  // Clear existing love stories and re-insert
  await query('DELETE FROM love_stories');
  for (const s of stories) {
    await query(
      'INSERT INTO love_stories (date, title, description, sort_order) VALUES ($1, $2, $3, $4)',
      [s.date, s.title, s.description, s.sort_order]
    );
  }

  // Add sample gifts
  await query('DELETE FROM gifts');
  const gifts = [
    { type: 'bank', bank_name: 'BCA', account_number: '1234567890', account_holder: 'Muhammad Nauval', sort_order: 1 },
    { type: 'bank', bank_name: 'Mandiri', account_number: '9876543210', account_holder: 'Nama Pasangan', sort_order: 2 },
  ];

  for (const g of gifts) {
    await query(
      'INSERT INTO gifts (type, bank_name, account_number, account_holder, sort_order) VALUES ($1, $2, $3, $4, $5)',
      [g.type, g.bank_name, g.account_number, g.account_holder, g.sort_order]
    );
  }

  // Add sample wishes
  const wishes = [
    { name: 'Budi Santoso', message: 'Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.', status: 'published' },
    { name: 'Dewi Lestari', message: 'Bahagia selalu untuk kalian berdua. Semoga cinta kalian abadi selamanya!', status: 'published' },
    { name: 'Ahmad Fauzi', message: 'Selamat ya! Semoga pernikahan ini membawa berkah dan kebahagiaan.', status: 'published' },
  ];

  for (const w of wishes) {
    await query(
      'INSERT INTO wishes (name, message, status) VALUES ($1, $2, $3)',
      [w.name, w.message, w.status]
    );
  }

  console.log('Seeding complete!');
  console.log(`- ${guestCount} guests added`);
  console.log(`- ${stories.length} love stories added`);
  console.log(`- ${gifts.length} gift accounts added`);
  console.log(`- ${wishes.length} wishes added`);
  console.log('\nDefault admin credentials:');
  console.log('  Username: admin');
  console.log('  Password: admin123');

  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
