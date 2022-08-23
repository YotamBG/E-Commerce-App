const { Pool } = require('pg');

const pool = new Pool({
    user: "postgres",
    password: "postgres",
    host: "localhost",
    port: 5432,
    database: "E-Commerce-App",
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
};