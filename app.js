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