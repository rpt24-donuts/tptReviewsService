const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tpt_reviews',
  password: '',
  port: 5432,
});

module.exports = pool;
