if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const session = require('express-session');
const db = require('./db');
const bodyParser = require('body-parser');
var passport = require('passport');
const bcrypt = require('bcrypt');
const initializePassport = require('./passport-config');


const app = express();
const port = 3000;
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET
}));
initializePassport(passport, db);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});

app.get('/', (req, res) => {
  res.send('Welcome to the e-commerce application!');
});

app.post('/users/register', async (req, res, next) => {
  const { username, password } = req.body;
  var hashedpassword = await bcrypt.hash(password, 10);
  db.query('SELECT * FROM users WHERE username = $1', [username], (err, result) => {
    if (err) {
      return next(err);
    }
    if (result.rows.length == 0) {
      db.query('INSERT INTO users (username, password) VALUES ($1, $2);', [username, hashedpassword], (err, result) => {
        if (err) {
          return next(err);
        }
        res.send('Registered successfully!');
      })
    } else {
      res.send('Username already used!');
    }
  })
});


app.post("/users/login",
  passport.authenticate("local", { failureRedirect: "/users/login" }),
  (req, res) => {
    res.redirect("/users/profile");
  }
);


app.get('/users/profile', (req, res, next) => {
  console.log('Profile of ', req.user);
  res.send('Hello ' + req.user.username + '!');
});


app.post('/users/logout', function (req, res) {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect('/');
  });
});

// GET, POST, PUT, DELETE enpoints plan

// /products (get all)
// /products/new-product
// /products/update-product/:productId
// /products/delete-product/:productId


// /users/register
// /users/login -> return cartId (to be saved in local storage)
// /users/logout -> delete all related carts
// /users/:username/update
// /users/:username/delete -> delete all related carts
// /users/:username/profile


// /carts/:cartId/new-item/:productId
// /carts/:cartId/remove-item/:productId
// /carts/:cartId/clear-cart

// /orders/newOrder/:cartId -> delete cart