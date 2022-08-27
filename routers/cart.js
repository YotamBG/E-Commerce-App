const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const checkAuthenticated = require('../utils/checkAuthenticated');

router.use((req, res, next) => {
    checkAuthenticated;
    next();
});

router.use((req, res, next) => {
    console.log("req.user = ", req.user);
    if (!req.user.cartId) {
        db.query(`SELECT cart_id FROM carts WHERE user_id=$1;`, [req.user.user_id], (err, result) => {
            if (result.rows.length != 0) {
                console.log('Cart found in database');
                req.user.cartId = result.rows[0].cart_id;
                console.log('Cart attached successfully!');
                console.log("req.user = ", req.user);
                next();
            } else {
                db.query('INSERT INTO carts (user_id) VALUES ($1);', [req.user.user_id], (err, result) => {
                    if (err) {
                        return next(err);
                    }
                    console.log('New cart created');

                    db.query(`SELECT cart_id FROM carts WHERE user_id=$1;`, [req.user.user_id], (err, result) => {
                        if (err) {
                            return next(err);
                        }
                        req.user.cartId = result.rows[0].cart_id;
                        console.log("req.user = ", req.user);
                        console.log('Cart attached successfully!');
                        next();
                    })
                })
            }
        })
    } else {
        console.log('Cart already attached'); //since the only data saved between calls is the user.id, you'd never get here.
        next();
    }
});


router.get('/', (req, res, next) => {
    const { cartId } = req.user;

    db.query(`
            SELECT products.product_id,	products.name,	products.price,	products.category, products_in_cart.quantity
            FROM products_in_cart
            JOIN products
                ON products_in_cart.product_id = products.product_id
            WHERE cart_id=$1;`,
        [cartId],
        (err, result) => {
            if (err) {
                return next(err);
            }
            console.log('Showing cart');
            res.send(result.rows);
        })
});


router.post('/new-item/:productId', (req, res, next) => {
    const { cartId } = req.user;
    const { productId } = req.params;

    db.query('SELECT * FROM products_in_cart WHERE cart_id = $1 AND product_id = $2;', [cartId, productId], (err, result) => {
        if (result.rows.length == 0) {
            //make sure product exists
            db.query('SELECT * FROM products WHERE product_id = $1;', [productId], (err, result) => {
                if (result.rows.length != 0) {
                    db.query('INSERT INTO products_in_cart (cart_id, product_id) VALUES ($1, $2);', [cartId, productId], (err, result) => {
                        if (err) {
                            return next(err);
                        }
                        console.log('New product added: ', { "product_id": productId, "cartId": cartId });
                        res.send('Product added to cart successfully!');
                    });
                }else{
                    res.send('Product doesn`t exists');
                }
            });
        } else {
            db.query('UPDATE products_in_cart SET quantity = quantity+1 WHERE cart_id = $1 AND product_id = $2;', [cartId, productId], (err, result) => {
                if (err) {
                    return next(err);
                }
                res.send('Product added to cart successfully! (increased amount)');
            })
        }
    });
});



router.post('/remove-item/:productId', (req, res, next) => {
    const { cartId } = req.user;
    const { productId } = req.params;

    db.query('SELECT * FROM products_in_cart WHERE cart_id = $1 AND product_id = $2;', [cartId, productId], (err, result) => {
        if (result.rows.length == 0) {
            res.send('Product not found in cart!');
        } else {
            if (result.rows[0].quantity == 1) {
                db.query('DELETE FROM products_in_cart WHERE cart_id = $1 AND product_id = $2;', [cartId, productId], (err, result) => {
                    if (err) {
                        return next(err);
                    }
                    res.send('Product removed from cart successfully!');
                })
            } else {
                db.query('UPDATE products_in_cart SET quantity = quantity-1 WHERE cart_id = $1 AND product_id = $2;', [cartId, productId], (err, result) => {
                    if (err) {
                        return next(err);
                    }
                    res.send('Product removed from cart successfully! (decreased amount)');
                })
            }
        }
    });
});



router.post('/clear-cart', (req, res, next) => {
    const { cartId } = req.user;

    db.query('DELETE FROM products_in_cart WHERE cart_id = $1;', [cartId], (err, result) => {
        if (err) {
            return next(err);
        }
        res.send('Cart cleared successfully!');
    })
});



module.exports = router;


// /cart/ V
// /cart/new-item/:productId V
// /cart/remove-item/:productId V
// /cart/clear-cart V

// /cart/checkout (-> delete cart)