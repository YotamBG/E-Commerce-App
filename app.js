const express = require('express');
const app = express();
const db = require('./db');
const port = 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to the e-commerce application!');
});

// app.get('/:id', (req, res, next) => {
//   db.query('SELECT * FROM users WHERE user_id = $1', [req.params.id], (err, result) => {
//     if (err) {
//       return next(err);
//     }
//     res.send(result.rows[0]);
//   })
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});


app.post('/users/register', (req, res, next) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = $1', [username], (err, result) => {
    if (err) {
      return next(err);
    }
    if (result.rows.length == 0) {
      db.query('INSERT INTO users (username, password) VALUES ($1, $2);', [username, password], (err, result) => {
        if (err) {
          return next(err);
        }
        res.send('success!');
      })
    } else {
      res.send('username already used!');
    }
  })
});



// GET, POST, PUT, DELETE

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