const passport = require('passport');
const User = require('../models/user');

exports.loginForm = (req, res) => {
  res.render('loginform');
};

exports.login = (req, res, next) => {
  passport.authenticate('local', function(err, user) {
    if (err) {
      return next('Password Error', err);
    }
    if (!user) {
      req.flash('error', 'Your Username or Password is incorrect');
      return res.render('loginform');
      // return res.json({ status: 'error', message: info.message });
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', `User logged in successfully`);
      return res.render('dashboard', {
        ...user.dataValues,
        productDetail: res.locals.products,
      });
    });
  })(req, res, next);
};

// Logout Handle
exports.logout = (req, res) => {
  req.logOut();
  req.flash('success', 'You are logged out');
  res.redirect('/login');
};

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  req.flash('error', 'Oops you must be logged in to do that!');
  res.redirect('/login');
};
