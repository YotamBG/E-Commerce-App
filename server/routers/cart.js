const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const checkAuthenticated = require('../utils/checkAuthenticated');
const deleteCart = require('../utils/deleteCart');
const payment = require('../utils/payment');

/**
 * @swagger
 * definitions:
 *   Cart:
 *     properties:
 *       total:
 *         type: integer
 *       items:
 *         type: array
 *         items:
 *            $ref: '#/definitions/Product'
 *     required:
 *         - total
 */


router.use(checkAuthenticated);

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



router.use((req, res, next) => {
    const { cartId } = req.user;
    db.query(`SELECT SUM(products_in_cart.quantity*products.price)
              FROM products_in_cart
              JOIN products
                  ON products.product_id = products_in_cart.product_id
              WHERE products_in_cart.cart_id = $1;`,
        [cartId],
        (err, result) => {
            if (err) {
                return next(err);
            }
            var total = 0;
            if (result.rows[0].sum != null) {
                total = result.rows[0].sum;
            }
            console.log("total = ", total);
            req.user.total = total;
            db.query('UPDATE carts SET total = $1 WHERE cart_id = $2;', [total, cartId], (err, result) => {
                if (err) {
                    return next(err);
                }
                next();
            })
        })
});


/**
 * @swagger
 * /cart:
 *   get:
 *     tags:
 *       - Cart
 *     description: Returns a user's cart
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A cart
 *         schema:
 *           $ref: '#/definitions/Cart'
 */
router.get('/', (req, res, next) => {
    const { cartId, total } = req.user;

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
            var cartView = { "Items": result.rows, "Total": total };
            res.status(200).send(cartView);
        })
});


/**
 * @swagger
 * /cart/new-item/{productId}:
 *   post:
 *     tags:
 *       - Cart
 *     description: Adds a product to the cart
 *     produces:
 *       - application/json
  *     parameters:
 *       - name: productId
 *         description: Product's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *       404:
 *         description: Product doesn`t exists
 */
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
                        res.status(200).send('Product added to cart successfully!');
                    });
                } else {
                    res.status(404).send('Product doesn`t exists');
                }
            });
        } else {
            db.query('UPDATE products_in_cart SET quantity = quantity+1 WHERE cart_id = $1 AND product_id = $2;', [cartId, productId], (err, result) => {
                if (err) {
                    return next(err);
                }
                res.status(200).send('Product added to cart successfully! (increased amount)');
            })
        }
    });
});


/**
 * @swagger
 * /cart/remove-item/{productId}:
 *   delete:
 *     tags:
 *       - Cart
 *     description: Removes a product from the cart
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: productId
 *         description: Product's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Product removed from cart successfully
 *       404:
 *         description: Product not found in cart
 */
router.delete('/remove-item/:productId', (req, res, next) => {
    const { cartId } = req.user;
    const { productId } = req.params;

    db.query('SELECT * FROM products_in_cart WHERE cart_id = $1 AND product_id = $2;', [cartId, productId], (err, result) => {
        if (result.rows.length == 0) {
            res.status(404).send('Product not found in cart!');
        } else {
            if (result.rows[0].quantity == 1) {
                db.query('DELETE FROM products_in_cart WHERE cart_id = $1 AND product_id = $2;', [cartId, productId], (err, result) => {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send('Product removed from cart successfully!');
                })
            } else {
                db.query('UPDATE products_in_cart SET quantity = quantity-1 WHERE cart_id = $1 AND product_id = $2;', [cartId, productId], (err, result) => {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send('Product removed from cart successfully! (decreased amount)');
                })
            }
        }
    });
});



/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     tags:
 *       - Cart
 *     description: Clears a user's cart
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 */
router.delete('/clear', (req, res, next) => {
    const { cartId } = req.user;

    db.query('DELETE FROM products_in_cart WHERE cart_id = $1;', [cartId], (err, result) => {
        if (err) {
            return next(err);
        }
        res.status(200).send('Cart cleared successfully!');
    })
});

/**
 * @swagger
 * /cart/checkout:
 *   post:
 *     tags:
 *       - Cart
 *     description: Checks out a user's cart
 *     produces:
 *       - application/json
 *     responses:
 *       400:
 *         description: Cart empty
 *       402:
 *         description: Payment failed
 *       200:
 *         description: Ordered
 *         schema:
 *           $ref: '#/definitions/Order'
 */
router.post('/checkout', async (req, res, next) => {
    const { cartId, username, user_id, total } = req.user;

    //check cart isn't empty
    const productsNum = parseInt((await db.query('SELECT COUNT(*) FROM products_in_cart WHERE cart_id = $1', [cartId])).rows[0].count);
    if (productsNum == 0) {
        return res.status(400).send('Cart empty!');
    }

    //implment example payment attempt
    if (!payment()) {
        return res.status(400).send('Payment failed!');
    }

    //list order in orders
    db.query('INSERT INTO orders (username, cart_id, date, total) VALUES ($1, $2, now(), $3);', [username, cartId, total], (err, result) => {
        if (err) {
            return next(err);
        }
    });

    const { order_id } = (await db.query('SELECT order_id FROM orders WHERE cart_id = $1', [cartId])).rows[0];

    console.log('order_id = ', order_id);

    //copy products from cart to order
    db.query(`
            INSERT INTO products_in_order (product_id, order_id, quantity)
            SELECT product_id, $1, quantity FROM products_in_cart WHERE cart_id = $2;`,
        [order_id, cartId],
        (err, result) => {
            if (err) {
                return next(err);
            }
            // send back the order as a response
            db.query(`
            SELECT products.product_id,	products.name,	products.price,	products.category, products_in_order.quantity
            FROM products_in_order
            JOIN products
                ON products_in_order.product_id = products.product_id
            WHERE order_id=$1;`,
                [order_id],
                (err, result) => {
                    if (err) {
                        return next(err);
                    }
                    const items = result.rows;
                    db.query('SELECT order_id, date, username, total FROM orders WHERE order_id = $1', [order_id], (err, result) => {
                        if (err) {
                            return next(err);
                        }
                        var orderView = { "Details": result.rows[0], "Items": items };
                        res.status(200).send(orderView);
                        deleteCart(db, user_id, next);
                    });
                });
        });
});

module.exports = router;


// /cart/ V
// /cart/new-item/:productId V
// /cart/remove-item/:productId V
// /cart/clear-cart V

// /cart/checkout (-> delete cart) V