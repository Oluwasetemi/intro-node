module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        } else {
            req.flash('error', 'Please login')
            res.render('loginform.ejs')
        }
    }
}