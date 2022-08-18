const express = require('express');
const app = express();
const db = require('./db');
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/:id', (req, res, next) => {
  db.query('SELECT * FROM users WHERE user_id = $1', [req.params.id], (err, result) => {
    if (err) {
      return next(err);
    }
    res.send(result.rows[0]);
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
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