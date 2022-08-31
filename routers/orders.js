const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const checkAuthenticated = require('../utils/checkAuthenticated');


router.use((req, res, next) => {
    checkAuthenticated;
    next();
});

router.get('/:orderId', async (req, res, next) => {
    const order_id = req.params.orderId;
    
    const items = (await db.query(`
            SELECT products.product_id,	products.name,	products.price,	products.category, products_in_order.quantity
            FROM products_in_order
            JOIN products
                ON products_in_order.product_id = products.product_id
            WHERE order_id=$1;`,
        [order_id])).rows;
    db.query('SELECT * FROM orders WHERE order_id = $1', [order_id], (err, result) => {
        if (err) {
            return next(err);
        }
        console.log("Items = ", items);
        console.log('Showing one order');
        var orderView = { "Details": result.rows[0], "Items": items };
        if(result.rows.length == 0){
            return res.send("No order found");
        }
        if(result.rows[0].username == req.user.username){
            return res.send(orderView);
        }else{
            return res.send("Not allowed to view another user's order");
        }
    })

});


router.get('/', (req, res, next) => {
    db.query('SELECT * FROM orders WHERE username = $1', [req.user.username], (err, result) => {
        if (err) {
            return next(err);
        }
        console.log('Showing all orders');
        res.send(result.rows);
    })
});



module.exports = router;