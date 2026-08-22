const express = require('express');
const cors = require('cors'); // install via: npm install cors
const db = require('./db');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// API test endpoint
app.get('/api/health', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ status: 'ok', db_time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});