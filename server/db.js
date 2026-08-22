const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  password: process.env.DB_PASSWORD || '',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'dayflow_db',
});

pool.query('SELECT NOW()', (error, result) => {
  if (error) console.error('Database Connection Error:', error.message);
  else console.log('Connected to PostgreSQL Database at:', result.rows[0].now);
});

module.exports = { query: (text, params) => pool.query(text, params) };
