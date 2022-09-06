const { Pool } = require('pg');

const devConfig = `postgresql://postgres:postgres@localhost:5432/E-Commerce-App`;

const proConfig = process.env.DATABASE_URL; //heroku addons

const options = process.env.NODE_ENV === "production" ? {connectionString: proConfig, ssl: 
  {rejectUnauthorized: false}} : {connectionString: devConfig};

const pool = new Pool(options);

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
};