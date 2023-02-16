function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.status(401).send({error: 'Not logged in!'});
    // res.redirect('/login');
}

module.exports = checkAuthenticated;