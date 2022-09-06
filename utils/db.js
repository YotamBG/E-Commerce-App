const { Pool } = require('pg');

const devConfig = `postgresql://${postgres}:${postgres}@${localhost}:${5432}/${E - Commerce - App}`;

const proConfig = process.env.DATABASE_URL; //heroku addons

const pool = new Pool({
  connectionString:
    process.env.NODE_ENV === "production" ? proConfig : devConfig,
  ssl: {
    rejectUnauthorized: false // don't check for SSL cert
  }
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
};