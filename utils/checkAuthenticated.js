function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.send('Not logged in!');
    // res.redirect('/login');
}

module.exports = checkAuthenticated;