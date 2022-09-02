const express = require('express');
const router = express.Router();
const db = require('../utils/db');


/**
 * @swagger
 * definitions:
 *   Product:
 *     properties:
 *       product_id:
 *         type: integer
 *       name:
 *         type: string
 *       price:
 *         type: integer
 *       category:
 *         type: string
 *     required:
 *         - product_id
 *         - name
 *         - price
 */



/**
 * @swagger
 * /products/{productId}:
 *   get:
 *     tags:
 *       - Products
 *     description: Returns a single product
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
 *         description: A single product
 *         schema:
 *           $ref: '#/definitions/Product'
 *       404:
 *         description: Product not found
 */
router.get('/:productId', (req, res, next) => {
    const product_id = req.params.productId;
    db.query('SELECT * FROM products WHERE product_id = $1', [product_id], (err, result) => {
        if (err) {
            return next(err);
        }
        console.log('Showing one product');
        if (result.rows.length != 0) {
            res.status(200).send(result.rows[0]);
        } else {
            res.status(404).send("Product not found!");
        }
    })
});

/**
 * @swagger
 * /products:
 *   get:
 *     tags:
 *       - Products
 *     description: Returns all products
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: category
 *         description: Product's category
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: An array of products
 *         schema:
 *           type: array
 *           items:
 *              $ref: '#/definitions/Product'
 */
router.get('/', (req, res, next) => {
    const category = req.query.category;
    if (category) {
        db.query('SELECT * FROM products WHERE category = $1 ORDER BY product_id;', [category], (err, result) => {
            if (err) {
                return next(err);
            }
            console.log('Showing product category');
            res.status(200).send(result.rows);
        })
    } else {
        db.query('SELECT * FROM products ORDER BY product_id;', [], (err, result) => {
            if (err) {
                return next(err);
            }
            console.log('Showing all products');
            res.status(200).send(result.rows);
        })
    }
});


/**
 * @swagger
 * /products/new-product:
 *   post:
 *     tags:
 *       - Products
 *     description: Creates a new product
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: product
 *         description: Product object
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             price:
 *               type: integer
 *             category:
 *               type: string
 *           required:
 *             - name
 *             - price
 *     responses:
 *       200:
 *         description: Successfully created
 */
router.post('/new-product', (req, res, next) => {
    const { name, price, category } = req.body;
    db.query('INSERT INTO products (name, price, category) VALUES ($1, $2, $3);', [name, price, category], (err, result) => {
        if (err) {
            return next(err);
        }
        console.log('New product added: ', { "name": name, "price": price, "category": category });
        res.status(201).send('Product added successfully!');
    })
});

/**
 * @swagger
 * /products/update-product/{productId}:
 *   put:
 *     tags:
 *       - Products
 *     description: Updates a product
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: productId
 *         description: Product's id
 *         in: path
 *         required: true
 *         type: integer
 *       - name: product
 *         description: Product object
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             price:
 *               type: integer
 *             category:
 *               type: string
 *           required:
 *             - name
 *             - price
 *     responses:
 *       200:
 *         description: Successfully updated
 *       404:
 *         description: Product not found
 */
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
                res.status(200).send('Updated successfully!');
            })
        } else {
            res.status(404).send('No product found!');
        }
    })
});


/**
 * @swagger
 * /products/delete-product/{productId}:
 *   delete:
 *     tags:
 *       - Products
 *     description: Deletes a product
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
 *         description: Deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete('/delete-product/:productId', async (req, res, next) => {
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
                res.status(200).send('Deleted successfully!');
            })
        } else {
            res.status(404).send('No product found!');
        }
    })
});



module.exports = router;