require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { initDB } = require('../server/db/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());

// Routes
app.use('/api', require('../server/routes/public'));
app.use('/api/admin', require('../server/routes/admin'));

// Initialize DB on cold start
let dbInitialized = false;
const originalHandler = app;

module.exports = async (req, res) => {
  if (!dbInitialized) {
    await initDB();
    dbInitialized = true;
  }
  return originalHandler(req, res);
};
