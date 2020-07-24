/* eslint-disable no-shadow */
const User = require('../models/user');
const product = require('../models/product');
const { hash } = require('../util/helpers');
const { send } = require('../util/mail');
const popup = require('node-popup');
const popup2 = require('node-popup/dist/cjs.js');
// const User = require('../models/user');
const { promisify } = require('util')
const passport = require('passport');

exports.homePage = (req, res) => {
  res.render('register.ejs');
};

// exports.product = (req, res) => {
//   res.send('myproduct');
// };

exports.register = async (req, res,  next) => {
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

    User.register({
        firstName,
        lastName,
        email,
        phone,
        username: firstName
    }, password, (err, user) => {
        if (err) {
            res.redirect('/register')
        }
            // console.log(user)
             if (user) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
        if (!user) {
            req.flash('error', `${info.message}`)
            return res.redirect('/login');
        }


        req.logIn(user, function(err) {
            if (err) { return next(err); }
            req.flash('success', `User registered successfully`)
            req.flash('success', `User logged in successfully`)
        return res.render('dashboard', {...res.locals.user.dataValues, productDetail: res.locals.products});
      });
    })(req, res, next);
  }
    })

        //   User.create({
        //     firstName,
        //     lastName,
        //     email,
        //     phone,
        //     password
        // })
        // .then(function(user) {
        //     // passport.authenticate('local')(req, res, function () {
        //     //   res.redirect('/');
        //     // });
        //     next()
        // });

}

/* exports.register = async (req, res) => {
  try {
    // console.log(req.body);
    const [firstName, lastName] = req.body.name.split(' ');
    const { password, password2, email, phone } = req.body;
    // console.log({ firstName, lastName, email, password });

    // Check required fields
    if(!firstName || !lastName || !email || !phone || !password || !password2) {
      req.flash('error', 'Please fill in all fields')
      res.render('register.ejs')
    } else if(password !== password2) { // Check passwords match
      req.flash('error', 'Password do not match')
      res.render('register.ejs')
    } else if(password.length < 8) { // Check password length
      req.flash('error', 'Password should be at least 8 characters')
      res.render('register.ejs')
  } else {

    const checkUser = await user.findOne({where: {email: email}}) // To check if the user exist
              if(checkUser) {
                    req.flash( 'error', 'User is already registered')
                    res.render('register.ejs')
                } else {



    const productDetail2 = await product.findAll(); //Sequelize Select Query

    // hash the password
    // const hashedPassword = await hash(password);
    const hashedPassword = await hash(password);

    // $2a$10$SDN0rmDS9sLu9hO3ZqSjguUmIBSEOuaxFBR2xDWu4eXLZxW28QDmG
    // $2a$10$H1Gpy2YV6DPBT4QU6TJweurW23G4B5LztFXqRAh.4CiWVthUJpzm6
    // $2a$10$oD/KIpGNq0Jo1tDlNWCl1uBu9W8BBusQYDv8XpShAk/.utkylI8T2
    const createdUser = await user.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword
    });

    // console.log(createdUser);

    if (!createdUser) {
      req.flash('error', 'Registration not successful, Please check your records');
      res.render('register.ejs')
    }

    // import {confirm} from 'node-popup';
    // const {confirm} = require('node-popup')
        // const main = async ()=>{
        //     try{
        //         await popup('Confirm or Deny?');
        //         console.log('Confirmed!');// OK button clicked
        //     }catch(error){
        //         console.log('Denied!');// cancel button clicked
        //     }
        // }
        // main();

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
    req.flash('success', 'Registration successful')
    res.render('loginform.ejs', {
      firstName: createdUser.dataValues.firstName,
      productDetail: productDetail2
    });
  };

  }
  } catch (error) {
    console.log(error.message);
    res.send('Error: Email did not sent');
  }
};
 */

exports.dashboard = (req, res) => {
  const { user } = res.locals;
  res.render('dashboard', { firstName: user.firstName });
};
