const { Pool } = require('pg');
require('dotenv').config();

const dbName = process.env.DB_NAME || 'dayflow_db';

// Base config from .env
const baseConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
};

async function seed() {
  // 1. Connect to default 'postgres' database to create the target database
  const rootPool = new Pool({ ...baseConfig, database: 'postgres' });

  try {
    const dbCheck = await rootPool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (dbCheck.rows.length === 0) {
      await rootPool.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Database "${dbName}" created successfully!`);
    } else {
      console.log(`ℹ️ Database "${dbName}" already exists.`);
    }
  } catch (err) {
    console.error('❌ Failed to check/create database:', err);
    process.exit(1);
  } finally {
    await rootPool.end(); // Close temporary connection
  }

  // 2. Connect to the target database and seed tables/data
  const appPool = new Pool({ ...baseConfig, database: dbName });

  try {
    console.log(`🌱 Seeding database "${dbName}"...`);

    // Create table
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert sample row
    const insertQuery = `
      INSERT INTO users (name)
      VALUES ($1)
      RETURNING *;
    `;

    const result = await appPool.query(insertQuery, ['John Doe']);
    console.log('✅ Seed successful! Inserted:', result.rows[0]);

  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  } finally {
    await appPool.end();
    process.exit(0);
  }
}

seed();