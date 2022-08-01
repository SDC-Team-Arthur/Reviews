const postgresql = require('pg');

const pool = new postgresql.Pool({
      user: '',
      database: 'reviews',
      password: '',
      host:'127.0.0.1',
      port: 5432
    });

module.exports = {pool};