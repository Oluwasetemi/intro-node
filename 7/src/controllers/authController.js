const passport = require('passport');
const User = require('../models/user');

// Loading Login Page
exports.loginForm = (req, res) => {
  const { user } = res.locals;
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    return res.render('dashboard', {
      user,
      users: user,
    });
  }
  // console.log(users);
  res.render('loginform', {
    users: user,
  });
};

// Login Handle
exports.login = (req, res, next) => {
  passport.authenticate('local', function(err, user) {
    if (err) {
      return next('Password Error', err);
    }
    if (!user) {
      req.flash('error', 'Your Username or Password is incorrect');
      return res.render('loginform', {
        users: user.dataValues,
      });
      // return res.json({ status: 'error', message: info.message });
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      // console.log(user.dataValues);
      req.flash('success', `User logged in successfully`);
      // { req.user.dataValues };
      // return res.redirect('/')
      // console.log(user.dataValues);
      return res.render('dashboard', {
        ...user.dataValues,
        user,
        users: user.dataValues,
      });
    });
  })(req, res, next);
};

// authentication
exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'Oops you must be logged in to do that!');
    return res.redirect('/login');
  }
  next();
};

// Authorization
exports.isAuthurized = (req, res, next) => {
  const { user } = res.locals;
  const { userType } = user.type;
  if (userType !== 'admin') {
    req.flash('error', 'Need user previlegis before you can access the files');
    return res.redirect('/dashboard');
  }
  // res.send('Working');
  next();
};

// Session Verification
exports.sessionChecker = (req, res, next) => {
  // console.log('Sess', req.session.passport);
  if (req.session.passport && req.cookies.adefams_shop) {
    // console.log('Session2', req.session.passport);
    return res.redirect('/dashboard');
  }
  next();
};

// Logout Handle
exports.logout = (req, res) => {
  if (req.isAuthenticated()) {
    req.logOut();
    req.session.destroy();
    // req.flash('success', 'You are logged out');
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
};
