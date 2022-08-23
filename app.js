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

// split to diffrent modules/routers to be imported and used

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


app.get('/users/profile', checkAuthenticated, (req, res, next) => {
  console.log('Profile of ', req.user);
  res.send('Hello ' + req.user.username + '!');
});


app.post('/users/logout', function (req, res) {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect('/');
  });
});


app.get('/products/:productId', (req, res, next) => {
  const product_id = req.params.productId;
  db.query('SELECT * FROM products WHERE product_id = $1', [product_id], (err, result) => {
    if (err) {
      return next(err);
    }
    console.log('Showing one product');
    res.send(result.rows[0]);
  })
});


app.get('/products', (req, res, next) => {
  const category = req.query.category;
  if (category) {
    db.query('SELECT * FROM products WHERE category = $1', [category], (err, result) => {
      if (err) {
        return next(err);
      }
      console.log('Showing product category');
      res.send(result.rows);
    })
  } else {
    db.query('SELECT * FROM products', [], (err, result) => {
      if (err) {
        return next(err);
      }
      console.log('Showing all products');
      res.send(result.rows);
    })
  }
});

app.post('/products/new-product', (req, res, next) => {
  const { name, price, category } = req.body;
  db.query('INSERT INTO products (name, price, category) VALUES ($1, $2, $3);', [name, price, category], (err, result) => {
    if (err) {
      return next(err);
    }
    console.log('New product added: ', { "name": name, "price": price, "category": category });
    res.send('Product added successfully!');
  })
});


app.post('/products/update-product/:productId', async (req, res, next) => {
  const product_id = req.params.productId;
  const { name, price, category } = req.body;
  console.log({ "product_id": product_id, "name": name, "price": price, "category": category });
  db.query('SELECT * FROM products WHERE product_id = $1', [product_id], (err, result) => {
    if (err) {
      return next(err);
    }
    if (result.rows.length != 0) {
      db.query('UPDATE products SET name = $1, price = $2, category = $3 WHERE product_id = $4;', [name, price, category, product_id], (err, result) => {
        if (err) {
          return next(err);
        }
        res.send('Updated successfully!');
      })
    } else {
      res.send('No product found!');
    }
  })
});


app.post('/products/delete-product/:productId', async (req, res, next) => {
  const product_id = req.params.productId;
  db.query('SELECT * FROM products WHERE product_id = $1', [product_id], (err, result) => {
    if (err) {
      return next(err);
    }
    if (result.rows.length != 0) {
      db.query('DELETE FROM products WHERE product_id=$1;', [product_id], (err, result) => {
        if (err) {
          return next(err);
        }
        res.send('Deleted successfully!');
      })
    } else {
      res.send('No product found!');
    }
  })
});



app.post('/users/:username/update', checkAuthenticated, async (req, res, next) => {
  const old_username = req.params.username;
  const new_username = req.body.username;
  const password = req.body.password;

  if(old_username != req.user.username){
    return res.send('Not authorised to update other users!');
  }

  var hashedpassword = await bcrypt.hash(password, 10);
  db.query('SELECT * FROM users WHERE username = $1', [old_username], (err, result) => {
    if (err) {
      return next(err);
    }
    if (result.rows.length != 0) {
      db.query('UPDATE users SET username = $1, password = $2 WHERE username = $3;', [new_username, hashedpassword, old_username], (err, result) => {
        if (err) {
          return next(err);
        }
        res.send('Updated successfully!');
      })
    } else {
      res.send('No user found!');
    }
  })
});


app.post('/users/:username/delete', checkAuthenticated, async (req, res, next) => {
  const {username} = req.params;

  if(username != req.user.username){
    return res.send('Not authorised to update other users!');
  }

  db.query('SELECT * FROM users WHERE username = $1', [username], (err, result) => {
    if (err) {
      return next(err);
    }
    if (result.rows.length != 0) {
      req.logout(function (err) {
        if (err) return next(err);
      });
      db.query('DELETE FROM users WHERE username=$1;', [username], (err, result) => {
        if (err) {
          return next(err);
        }
        res.send('Deleted successfully!');
      })
    } else {
      res.send('No user found!');
    }
  })
});


function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.send('Not logged in!');
  // res.redirect('/users/login');
}



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