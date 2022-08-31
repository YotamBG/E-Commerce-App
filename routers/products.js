const express = require('express');
const router = express.Router();
const db = require('../utils/db');



router.get('/:productId', (req, res, next) => {
    const product_id = req.params.productId;
    db.query('SELECT * FROM products WHERE product_id = $1', [product_id], (err, result) => {
        if (err) {
            return next(err);
        }
        console.log('Showing one product');
        res.send(result.rows[0]);
    })
});


router.get('/', (req, res, next) => {
    const category = req.query.category;
    if (category) {
        db.query('SELECT * FROM products WHERE category = $1 ORDER BY product_id;', [category], (err, result) => {
            if (err) {
                return next(err);
            }
            console.log('Showing product category');
            res.send(result.rows);
        })
    } else {
        db.query('SELECT * FROM products ORDER BY product_id;', [], (err, result) => {
            if (err) {
                return next(err);
            }
            console.log('Showing all products');
            res.send(result.rows);
        })
    }
});


router.post('/new-product', (req, res, next) => {
    const { name, price, category } = req.body;
    db.query('INSERT INTO products (name, price, category) VALUES ($1, $2, $3);', [name, price, category], (err, result) => {
        if (err) {
            return next(err);
        }
        console.log('New product added: ', { "name": name, "price": price, "category": category });
        res.send('Product added successfully!');
    })
});


router.put('/update-product/:productId', async (req, res, next) => {
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


router.post('/delete-product/:productId', async (req, res, next) => {
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



module.exports = router;