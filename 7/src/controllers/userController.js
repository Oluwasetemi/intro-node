const { promisify } = require('util');
const passport = require('passport');
/* eslint-disable no-shadow */
const User = require('../models/user');
const product = require('../models/product');
const { hash } = require('../util/helpers');
const { send } = require('../util/mail');
// const popup = require('node-popup');
// const popup2 = require('node-popup/dist/cjs.js');
// const User = require('../models/user');

exports.homePage = (req, res) => {
  res.render('register.ejs');
};

// exports.product = (req, res) => {
//   res.send('myproduct');
// };

exports.register = async (req, res, next) => {
  const [firstName, lastName] = req.body.name.split(' ');
  const { password, password2, email, phone } = req.body;

  User.register(
    {
      firstName,
      lastName,
      email,
      phone,
      username: firstName,
    },
    password,
    (err, user) => {
      if (err) {
        console.log(err.message);
        res.redirect('/register');
      }
      // console.log(user)
      if (user) {
        passport.authenticate('local', function(err, user, info) {
          if (err) {
            return next(err);
          }
          if (!user) {
            req.flash('error', `${info.message}`);
            return res.redirect('/login');
          }

          req.logIn(user, function(err) {
            if (err) {
              return next(err);
            }
            req.flash('success', `User registered successfully`);
            req.flash('success', `User logged in successfully`);
            return res.render('dashboard', {
              ...res.locals.user.dataValues,
              productDetail: res.locals.products,
            });
          });
        })(req, res, next);
      }
    }
  );
};

exports.dashboard = (req, res) => {
  const { user } = res.locals;
  res.render('dashboard', { firstName: user.firstName });
};
