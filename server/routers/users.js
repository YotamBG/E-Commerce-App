const express = require('express');
const passport = require('passport');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../utils/db');
const checkAuthenticated = require('../utils/checkAuthenticated');
const deleteCart = require('../utils/deleteCart');

/**
 * @swagger
 * definitions:
 *   User:
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *         format: password
 *     required:
 *       - username
 *       - password
 */



/**
 * @swagger
 * /users/register:
 *   post:
 *     tags:
 *       - Users
 *     description: Creates a new user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: User details
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/User'
 *     responses:
 *       201:
 *         description: Successfully registered
 *       400:
 *         description: Username already used
 */
router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    var hashedpassword = await bcrypt.hash(password, 10);
    db.query('SELECT * FROM users WHERE username = $1', [username], (err, result) => {
        if (err) {
            return next(err);
        }
        if (result.rows.length == 0) {
            db.query('INSERT INTO users (username, password) VALUES ($1, $2);', [username, hashedpassword], (err, result) => {
                if (err) {
                    return next(err);
                }

                passport.authenticate('local')(req, res, function () {
                    res.status(201).send('Registered successfully!');
                });
            })
        } else {
            res.status(400).send('Username already used!');
        }
    })
});


/**
 * @swagger
 * /users/login:
 *   post:
 *     tags:
 *       - Users
 *     description: Logs in a user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: User details
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/User'
 *     responses:
 *       201:
 *         description: Successfully logged in
 *       500:
 *         description: Wrong username or password
 */
router.post("/login",
    passport.authenticate("local", { failureRedirect: "/login" }),
    (req, res) => {
        res.send('logged in ' + req.user.username);
        // res.redirect("/users/profile");
    }
);


/**
 * @swagger
 * /users/profile:
 *   get:
 *     tags:
 *       - Users
 *     description: Displays a user's profile
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: A simple string response
 *         schema:
 *           type: string
 *           example: "Hello Jake!"
 *       401:
 *         description: Not logged in
 */
router.get('/profile', checkAuthenticated, (req, res, next) => {
    console.log('Profile of ', req.user);
    res.status(200).send({'message': `Hello ${req.user.username}!`});
});

/**
 * @swagger
 * /users/logout:
 *   post:
 *     tags:
 *       - Users
 *     description: Logs out a user
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
router.post('/logout', function (req, res) {
    req.logout(function (err) {
        if (err) return next(err);
        res.redirect('/');
    });
});

/**
 * @swagger
 * /users/{username}/update:
 *   put:
 *     tags:
 *       - Users
 *     description: Updates a user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: A user's username
 *         in: path
 *         required: true
 *         type: string
 *       - name: user
 *         description: User details
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/User'
 *     responses:
 *       202:
 *         description: Successfully updated
 *       404:
 *         description: User not found
 *       403:
 *         description: Not authorised to update other users
 */
router.put('/:username/update', checkAuthenticated, async (req, res, next) => {
    const old_username = req.params.username;
    const new_username = req.body.username;
    const password = req.body.password;

    if (old_username != req.user.username) {
        return res.status(403).send('Not authorised to update other users!');
    }

    var hashedpassword = await bcrypt.hash(password, 10);
    db.query('SELECT * FROM users WHERE username = $1', [old_username], (err, result) => {
        if (err) {
            return next(err);
        }
        if (result.rows.length != 0) {
            db.query('UPDATE users SET username = $1, password = $2 WHERE username = $3;', [new_username, hashedpassword, old_username], (err, result) => {
                if (err) {
                    return next(err);
                }
                res.status(200).send('Updated successfully!');
            })
        } else {
            res.status(404).send('No user found!');
        }
    })
});

/**
 * @swagger
 * /users/{username}/delete:
 *   delete:
 *     tags:
 *       - Users
 *     description: Deletes a user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: A user's username
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       404:
 *         description: User not found
 *       403:
 *         description: Not authorised to delete other users
 */
router.delete('/:username/delete', checkAuthenticated, async (req, res, next) => {
    const { username } = req.params;
    const { user_id } = req.user;

    if (username != req.user.username) {
        return res.status(403).send('Not authorised to delete other users!');
    }

    await deleteCart(db, user_id, next);

    db.query('SELECT * FROM users WHERE username = $1', [username], (err, result) => {
        if (err) {
            return next(err);
        }
        if (result.rows.length != 0) {
            req.logout(function (err) {
                if (err) return next(err);
            });
            db.query('DELETE FROM users WHERE username=$1;', [username], (err, result) => {
                if (err) {
                    return next(err);
                }
            })
        } else {
            res.status(404).send('No user found!');
        }
    });

    res.status(200).send('User deleted successfully!');
});



module.exports = router;