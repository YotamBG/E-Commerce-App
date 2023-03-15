const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const checkAuthenticated = require('../utils/checkAuthenticated');


/**
 * @swagger
 * definitions:
 *   Order:
 *     properties:
 *       Details:
 *        properties:
 *          order_id:
 *            type: integer
 *          date:
 *           type: string
 *           format: date-time
 *          username:
 *           type: string
 *          total:
 *           type: integer
 *        required:
 *            - order_id
 *            - date
 *            - username
 *            - total
 *       items:
 *         type: array
 *         items:
 *            $ref: '#/definitions/Product'
 *     required:
 *         - Details
 *         - items
 */

 router.use(checkAuthenticated);

/**
 * @swagger
 * /orders/{orderId}:
 *   get:
 *     tags:
 *       - Orders
 *     description: Returns a single order
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: orderId
 *         description: Order's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single order
 *         schema:
 *           $ref: '#/definitions/Order'
 *       403:
 *         description: Not allowed to view another user's order
 *       404:
 *         description: Order not found
 */
router.get('/:orderId', async (req, res, next) => { //use user_id instead
    const order_id = parseInt(req.params.orderId);
    
    const items = (await db.query(`
            SELECT products.product_id,	products.name, products.img, products.price, products.category, products_in_order.quantity
            FROM products_in_order
            JOIN products
                ON products_in_order.product_id = products.product_id
            WHERE order_id=$1
            ORDER BY products.name;`,
        [order_id])).rows;
    db.query('SELECT order_id, date, username, total FROM orders WHERE order_id = $1', [order_id], (err, result) => {
        if (err) {
            return next(err);
        }
        console.log("Items = ", items);
        console.log('Showing one order');
        var orderView = { "Details": result.rows[0], "Items": items };
        if(result.rows.length == 0){
            return res.status(404).send({error: "No order found"});
        }
        if(result.rows[0].username == req.user.username){
            return res.status(200).send(orderView);
        }else{
            return res.status(403).send({error: "Not allowed to view another user's order"});
        }
    })

});


/**
 * @swagger
 * /orders:
 *   get:
 *     tags:
 *       - Orders
 *     description: Returns all of a user's orders
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of orders
 *         schema:
 *           type: array
 *           items:
 *              $ref: '#/definitions/Order'
 */
router.get('/', (req, res, next) => {
    db.query('SELECT order_id, date, username, total FROM orders WHERE username = $1', [req.user.username], (err, result) => {
        if (err) {
            return next(err);
        }
        console.log('Showing all orders');
        res.status(200).send(result.rows);
    })
});



module.exports = router;