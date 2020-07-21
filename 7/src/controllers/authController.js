const User = require('../models/user');
const { match } = require('../util/helpers');
const passport = require('passport')

exports.loginForm = (req, res) => {
  res.render('loginform');
};

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/',
  successFlash: 'You are now logged in!'
})

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
 */

// Logout Handle
exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/loginform')
}

