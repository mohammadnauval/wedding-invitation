# Wedding Invitation Website

Website undangan pernikahan digital dengan Administrator Dashboard.

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS v4
- **Backend**: Express.js + PostgreSQL (Neon)
- **Auth**: JWT
- **Upload**: Multer
- **Database**: PostgreSQL hosted on Neon (serverless)

## Quick Start

### Prerequisites
- Node.js >= 18
- PostgreSQL database (Neon URL already configured in .env)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

This runs both:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Seed Sample Data

```bash
npm run db:seed
```

### Build for Production

```bash
npm run build
npm start
```

## Default Admin Credentials

```
Username: admin
Password: admin123
```

Access admin dashboard at: http://localhost:3000/admin/login

## Project Structure

```
├── index.html              # Entry HTML
├── src/                    # Frontend React app
│   ├── components/
│   │   └── wedding/        # Public invitation components
│   ├── pages/
│   │   ├── admin/          # Admin dashboard pages
│   │   ├── WeddingPage.jsx # Main invitation page
│   │   └── NotFound.jsx
│   ├── hooks/              # Custom hooks
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── server/                 # Backend Express server
│   ├── db/
│   │   ├── database.js     # PostgreSQL (Neon) setup & schema
│   │   └── seed.js         # Sample data seeder
│   ├── middleware/
│   │   └── auth.js         # JWT authentication
│   ├── routes/
│   │   ├── admin.js        # Admin API routes
│   │   └── public.js       # Public API routes
│   └── index.js            # Server entry
├── uploads/                # Uploaded media (auto-created)
├── .env                    # Environment variables (DATABASE_URL)
└── package.json
```

## Features

### Public Wedding Website
- Cover/Opening with personal guest name
- Hero section
- Greeting with Islamic verse
- Couple profile (Groom & Bride)
- Love Story timeline
- Wedding Events with Google Maps
- Countdown timer
- Photo Gallery with lightbox
- RSVP form with guest quota
- Wishes/Guestbook
- Wedding Gift (bank transfer)
- Background music player
- Floating navigation
- Mobile-first responsive design
- Desktop: centered card layout

### Admin Dashboard
- Dashboard with RSVP statistics
- Couple management
- Event management
- Love Story management
- Gallery management (upload/delete)
- Music management
- Wedding Gift management
- Guest list (CRUD, copy link, WhatsApp message)
- RSVP management & export
- Wishes moderation
- Content management
- Settings (feature toggles, RSVP deadline)

## URLs

- **Public**: `/invite/{guest-slug}?t={token}`
- **Admin**: `/admin`
- **API**: `/api/*`
