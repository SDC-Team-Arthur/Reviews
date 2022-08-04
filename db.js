const postgresql = require('pg');
const {PGUSER, PGPASSWORD, PGHOST, PGDATABASE, PGPORT} = require('./config.js');

const pool = new postgresql.Pool({
      user: PGUSER,
      database: PGDATABASE,
      password: PGPASSWORD,
      host: PGHOST,
      port: PGPORT
    });

module.exports = {pool};