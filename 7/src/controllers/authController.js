const User = require('../models/user');
const { match } = require('../util/helpers');

exports.loginForm = (req, res) => {
  res.render('loginform');
};

exports.login = async (req, res) => {
  // check if email exist
  console.log(req.body.email);
  const userExist = await User.findOne({ where: { email: req.body.email } });

  if (!userExist) {
    throw new Error('User with email does not exist');
  }

  // redirect for failed login with error message and use flash
  // check if password matches what was saved in the db
  const matched = await match(req.body.password, userExist.password);

  if (!matched) {
    throw new Error('incorrect user pssword');
  }
  // create a session / cookie
  req.session.userId = userExist.id;

  //
  req.session.save(res.redirect('/dashboard'));
};
