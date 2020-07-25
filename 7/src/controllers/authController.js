const User = require('../models/user');
const { match } = require('../util/helpers');
const passport = require('passport')

exports.loginForm = (req, res) => {
  res.render('loginform');
};

exports.login = (req, res, next) => {
    // User.authenticate()(req.body.email, req.body.password, (err, user, error) => {
    //     if (err) {
    //         console.log(err.message)
    //         req.flash('error', 'ServerError!')
    //         return res.redirect('/login')
    //     }

    //     if (!user) {
    //         req.flash('error', `${error.message}`)
    //         return res.redirect('/login')
    //     }


    //     res.redirect('/dashboard')
    // })

passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      return res.json({status: 'error', message: info.message});
    }
    req.logIn(user, function(err) {
        if (err) { return next(err); }
        req.flash('success', `User logged in successfully`)
        return res.render('dashboard', {...user.dataValues, productDetail: res.locals.products});
    });
  })(req, res, next);
}

/* exports.login = async (req, res) => {
  // check if email exist
  console.log(req.body.email);
  const userExist = await User.findOne({ where: { email: req.body.email } });

  if (!userExist) {
    req.flash('error', `User does not exist`)
    res.render('loginform.ejs')
  }

  // redirect for failed login with error message and use flash
  // check if password matches what was saved in the db
  const matched = await match(req.body.password, userExist.password);

  if (!matched) {
    req.flash('error', 'Password is not correct')
    res.render('loginform.ejs')
  }
  // create a session / cookie
  req.session.userId = userExist.id;

  //
  req.session.save(res.redirect('/dashboard'));
};
 

// Logout Handle
exports.logout = (req, res) => {
    console.log('logged out')
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/login')
}

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
        return
    }
    req.flash('error', 'Oops you must be logged in to do that!')
    res.redirect('/login')
}
*/