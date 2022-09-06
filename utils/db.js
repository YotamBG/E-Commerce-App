const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,	// use DATABASE_URL environment variable from Heroku app 
  ssl: {
    rejectUnauthorized: false // don't check for SSL cert
  }
  // user: "postgres",
  // password: "postgres",
  // host: "localhost",
  // port: 5432,
  // database: "E-Commerce-App",
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
};