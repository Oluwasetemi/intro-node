const { promisify } = require('util');
const passport = require('passport');
/* eslint-disable no-shadow */
const User = require('../models/user');
const product = require('../models/product');
const { hash } = require('../util/helpers');
const { send } = require('../util/mail');
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

  // const createdUser = await User.create({
  //     firstName,
  //     lastName,
  //     email,
  //     phone,
  //     username: firstName
  // })

  // console.log(user.register.toString())

  // const register = promisify(User.register);
  // const result = await register({
  //     firstName,
  //     lastName,
  //     email,
  //     phone,
  //     username: firstName
  // }, password)

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
        res.redirect('/register');
      }
      // console.log(user)
      /*

    //   using nodemailer to test with mailtrap
    // 3. Email them that reset token
    // const mailRes = await transport.sendMail({
    //   from: 'shop@adefams.dev',
    //   to: [createdUser.email],
    //   subject: 'Registration Successful',
    //   html: makeANiceEmail(`
    //         Welcome to Adefams Shop! We sell at the cheapest rate in the world \n\n
    //       `)
    // });

    // await send({
    //   filename: 'welcome-to-adefam',
    //   to: createdUser.email,
    //   subject: 'Registration Successful',
    //   name: createdUser.firstName
    // });
    //     req.flash('success', 'Registration successful')
    //     res.render('loginform.ejs', {
    //       firstName: createdUser.dataValues.firstName,
    //       productDetail: productDetail2
    //     });
    //   };

    //   }
    //   } catch (error) {
    //     console.log(error.message);
    //     res.send('Error: Email did not sent');
    //   }
    // };
 */
      // try to authenticate the created user
      if (user) {
        passport.authenticate('local', function(err, user, info) {
          if (err) {
            return next(err);
          }
          if (!user) {
            req.flash('error', `${info.message}`);
            return res.redirect('/login');
          }

          // try to log in the authenticated user
          req.logIn(user, function(err) {
            if (err) {
              return next(err);
            }
            req.flash('success', `User registered successfully`);
            req.flash('success', `User logged in successfully`);
            return res.render('dashboard', {
              ...user.dataValues,
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
