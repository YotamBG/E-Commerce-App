if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const session = require('express-session');
const db = require('./utils/db');
const bodyParser = require('body-parser');
const passport = require('passport');
const initializePassport = require('./utils/passport-config');


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


const users = require('./routers/users');
app.use('/users', users);
const products = require('./routers/products');
app.use('/products', products);



// GET, POST, PUT, DELETE enpoints plan

// /products (get all) V
// /products/new-product V
// /products/update-product/:productId V
// /products/delete-product/:productId V


// /users/register V
// /users/login V (-> return cartId to be saved in local storage)
// /users/logout V (-> delete all related carts)
// /users/:username/update V
// /users/:username/delete V (-> delete all related carts)
// /users/:username/profile V


// /carts/:cartId/new-item/:productId
// /carts/:cartId/remove-item/:productId
// /carts/:cartId/clear-cart
// /carts/:cartId/checkout (-> delete cart)

// /orders/
// /orders/:orderId