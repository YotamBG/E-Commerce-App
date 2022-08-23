const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;


function initialize(passport, db) {
    passport.use(new LocalStrategy(function verify(username, password, done) {
        db.query('SELECT * FROM users WHERE username = $1', [username], async function (err, user) {
            // console.log('searcing for user with username:', username);
            if (err) return done(err);
            // console.log('No searching errors found');
            if (user.rows.length == 0) return done('Incorrect username', false);
            // console.log('Username found!');
            if (! await bcrypt.compare(password, user.rows[0].password)) return done('Incorrect password', false);
            // console.log('Password correct!');
            console.log('User found: ', user.rows[0]);
            return done(null, user.rows[0])
        });
    }));

    passport.serializeUser((user, done) => {
        done(null, user.user_id);
    });

    passport.deserializeUser((id, done) => {
        db.query('SELECT * FROM users WHERE user_id = $1', [id], function (err, user) {
            if (err) return done(err);
            done(null, user.rows[0])
        })
    });
}


module.exports = initialize;