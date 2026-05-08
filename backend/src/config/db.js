const { Pool } = require('pg');

// Connection pool — multiple requests एकत्र handle
const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 10,                    // max 10 connections
  idleTimeoutMillis: 30000,   // 30 sec idle नंतर close
  connectionTimeoutMillis: 2000
});

pool.on('error', (err) => {
  console.error('PostgreSQL pool error:', err.message);
});

module.exports = { pool };