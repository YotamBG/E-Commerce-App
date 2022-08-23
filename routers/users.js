const express = require('express');
const passport = require('passport');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../utils/db');
const checkAuthenticated = require('../utils/checkAuthenticated');



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
                res.send('Registered successfully!');
            })
        } else {
            res.send('Username already used!');
        }
    })
});


router.post("/login",
    passport.authenticate("local", { failureRedirect: "/login" }),
    (req, res) => {
        res.redirect("/users/profile");
    }
);


router.get('/profile', checkAuthenticated, (req, res, next) => {
    console.log('Profile of ', req.user);
    res.send('Hello ' + req.user.username + '!');
});


router.post('/logout', function (req, res) {
    req.logout(function (err) {
        if (err) return next(err);
        res.redirect('/');
    });
});


router.post('/:username/update', checkAuthenticated, async (req, res, next) => {
    const old_username = req.params.username;
    const new_username = req.body.username;
    const password = req.body.password;

    if (old_username != req.user.username) {
        return res.send('Not authorised to update other users!');
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
                res.send('Updated successfully!');
            })
        } else {
            res.send('No user found!');
        }
    })
});


router.post('/:username/delete', checkAuthenticated, async (req, res, next) => {
    const { username } = req.params;

    if (username != req.user.username) {
        return res.send('Not authorised to update other users!');
    }

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
                res.send('Deleted successfully!');
            })
        } else {
            res.send('No user found!');
        }
    })
});



module.exports = router;