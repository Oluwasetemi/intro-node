const fs = require('fs');
const { promisify } = require('util');
const passport = require('passport');
/* eslint-disable no-shadow */
const User = require('../models/user');
// const Product = require('../models/product');
// const { hash } = require('../util/helpers');
// const { send } = require('../util/mail');

exports.registration = (req, res) => {
  const { user } = res.locals;
  if (req.isAuthenticated() && user.type === 'admin') {
    return res.render('register.ejs', {
      users: user,
    });
  }
  if (req.isAuthenticated() && user.type === 'user') {
    req.flash('error', 'You have an account already');
    res.redirect('/dashboard');
  }
  return res.render('register.ejs', {
    users: user,
  });
};

exports.register = async (req, res, next) => {
  const [firstName, lastName] = req.body.name.split(' ');
  const { password, password2, email, phone } = req.body;
  const { user } = res.locals;

  const checkUser = await User.findOne({ where: { email } }); // To check if the user exist
  if (checkUser) {
    req.flash('error', 'User is already registered');
    return res.render('register.ejs', {
      users: user,
    });
  }

  if (password !== password2) {
    req.flash('error', 'Password do not match');
    return res.render('register.ejs', {
      users: user,
    });
  }
  if (password.length < 8) {
    // Check password length
    req.flash('error', 'Password should be at least 8 characters');
    return res.render('register.ejs', {
      users: user,
    });
  }

  User.register(
    {
      firstName,
      lastName,
      email,
      phone,
      username: email,
    },
    password,
    (err, user) => {
      if (err) {
        console.log('Error Message:', err);
        req.flash('error', `${err.message}`);
        res.redirect('/register');
      }
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
            req.flash('success', `User registered and login successfully`);
            // console.log(user);
            return res.render('dashboard', {
              firstName: user.dataValues.firstName,
              // ...res.locals.products.dataValues,
              productDetail: res.locals.products,
              user: user.dataValues,
              users: user,
            });
          });
        })(req, res, next);
      }
    }
  );
};

exports.dashboard = (req, res) => {
  const { user } = res.locals;
  // console.log('Dashboard:', user);
  return res.render('dashboard', { firstName: user.firstName, users: user });
};

exports.viewUsers = async (req, res) => {
  try {
    const { username } = req.params; // Get username from the database
    const { user } = res.locals;
    if (!username) {
      return res.send('Error. You must pass a Username');
    }

    // console.log(user.type);
    // Find a user base on username using Sequelize query.
    if (user.type === 'admin') {
      const usersDetail = await User.findAll();

      if (!usersDetail) {
        return res.send('Error. User details not find')
      }

      res.render('viewUser', {
        username,
        user: usersDetail,
        users: user,
        // ,message: ''
      });
    } else {
      const userDetails = await User.findOne({
        where: {
          username,
        },
      });

      if (!userDetails) {
        return res.send('Error. User details not find');
      }

      res.render('dashboard.ejs', {
        username,
        user: userDetails,
        users: user,
        // ,message: ''
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

exports.viewUser = async (req, res) => {
  try {
    const { username } = req.params; // Get product Id from the database
    const { user } = res.locals;
    // console.log(user.username);
    if (!username && !user.username) {
      return res.send('Error. You must pass a Username');
    }

    // Find a product base on product Id using Sequelize query.
    const userDetails = await User.findOne({
      where: {
        username: username || user.username,
      },
    });

    // console.log(userDetails);

    if (!userDetails) {
      return res.send('Error. User details not find');
    }

    res.render('dashboard.ejs', {
      username,
      user: userDetails,
      users: user,
      // ,message: ''
    });
  } catch (error) {
    console.log(error.message);
  }
};

// Update fetched product
exports.editUser = async (req, res) => {
  try {
    const { user } = res.locals;
    if (!req.files) {
      const { username } = req.params;
      const { firstName, lastName, email, phone } = req.body;

      // Update The Product Record
      const updateUser = await User.update(
        {
          // lastName: "Doe",
          username,
          firstName,
          lastName,
          email,
          phone,
        },
        {
          where: {
            username,
          },
        }
      );

      if (!updateUser) {
        res.send("Error: User can't be Updated");
      }

      const userDetails = await User.findOne({
        where: {
          username,
        },
      });

      req.flash('success', 'Record Updated Successfully');
      res.render('dashboard.ejs', {
        user: userDetails,
        users: user,
        // message: ''
      });
    } else {
      const { username } = req.params;
      const { firstName } = req.body;
      const { lastName } = req.body;
      const { email } = req.body;
      const { phone } = req.body;
      const uploadedFile = req.files.image;

      let image = uploadedFile.name;

      const fileExtension = uploadedFile.mimetype.split('/')[1];

      image = `${username}.${fileExtension}`;

      if (
        uploadedFile.mimetype === 'image/png' ||
        uploadedFile.mimetype === 'image/jpeg' ||
        uploadedFile.mimetype === 'image/gif'
      ) {
        // upload the file to the /public/img directory
        uploadedFile.mv(`./src/public/userimg/${image}`, async err => {
          if (err) {
            console.log('Errror:', err.message);
            return res.status(500).send(err);
          }
          // Update The Product Record
          const updateUser = await User.update(
            {
              // lastName: "Doe",
              username,
              firstName,
              lastName,
              email,
              phone,
              image,
            },
            {
              where: {
                username,
              },
            }
          );

          if (!updateUser) {
            res.send("Error: Product can't be Updated");
          }

          const userDetails = await User.findOne({
            where: {
              username,
            },
          });

          req.flash('success', 'Record Updated Successfully');
          res.render('dashboard.ejs', {
            user: userDetails,
            users: user,
            // message: ''
          });
        });
      } else {
        req.flash(
          'error',
          "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed."
        );
        return res.render('dashboard.ejs', {
          users: user,
        });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

// Delete User from database
exports.deleteUser = async (req, res) => {
  try {
    const { username } = req.params;

    // console.log('Delete', username);
    if (!username) {
      res.send('Error. You must pass a username');
    }

    const deleteImage = await User.findOne({
      where: {
        username,
      },
    });

    const { image } = deleteImage;

    // console.log(image);

    const deleteUser = await User.destroy({
      where: {
        username,
      },
    });

    if (deleteUser) {
      fs.unlink(`src/public/userimg/${image}`, async err => {
        if (err) {
          return res.status(500).send(err);
        }
        res.redirect('/login');
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};
