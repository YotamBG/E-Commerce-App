const deleteCart = async (db, user_id, next) => {
    console.log('deleting cart...');
    db.query('SELECT cart_id FROM carts WHERE user_id=$1;', [user_id], (err, result) => {
        if (result.rows.length != 0) {
            cartId = result.rows[0].cart_id;
            db.query('DELETE FROM products_in_cart WHERE cart_id = $1;', [cartId], (err, result) => {
                if (err) {
                    return next(err);
                }
            })
            db.query('DELETE FROM carts WHERE user_id = $1;', [user_id], (err, result) => {
                if (err) {
                    return next(err);
                }
            });
        }
    });
    return next();
};


module.exports = deleteCart;
