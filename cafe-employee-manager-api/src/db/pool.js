const { Pool } = require('pg');

// Database connection configuration
const pool = new Pool({
  user: 'user',
  host: 'localhost',
  database: 'EmployeeCafe',
  password: 'user',
  port: 5432, // Default PostgreSQL port
});

pool.on('connect', () => {
  console.log('Connected to the database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err.stack);
});

module.exports = pool;
