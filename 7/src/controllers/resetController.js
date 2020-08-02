const nodemailer = require('nodemailer');
// const passport = require('passport');
const User = require('../models/user');
// const { match } = require('../util/helpers');

exports.passwordReset = (req, res) => {
  res.render('forgetPassword.ejs');
};

exports.reset = async (req, res) => {
  // check if email exist
  // console.log(req.body.email);
  const userExist = await User.findOne({ where: { email: req.body.email } });
  console.log(userExist);
  if (!userExist) {
    req.flash('error', `User does not exist`);
    return res.render('forgetPassword.ejs');
  }
  const username = userExist.dataValues.email;
  console.log(username);
  User.setResetPasswordKey(username, async function(err, updatedUser) {
    if (err) {
      return res.send(err.message);
    }

    const setUrl = `http://${req.headers.host}/resetpassword/${
      updatedUser.dataValues.resetPasswordKey
    }`;
    //   console.log(updatedUser.dataValues.resetPasswordKey);
    //  console.log(req.user.dataValues.resetPasswordKey);
    //  console.log(setUrl);

    // const { resetPasswordKey } = req.user.dataValues;
    //  const updateUser = await User.update({
    //   // lastName: "Doe",
    //   resetPasswordKey

    // }, {
    //   where: {
    //     email: req.body.email
    //   }
    // });
    const output = `
      <h3>You requested for password reset</h3>
      <p>Click on the link below to reset you password</p>
      <a href=${setUrl}> Rest Password </a>
      `;

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      secure: true,
      port: 465,
      auth: {
        user: 'famosaade@gmail.com',
        pass: 'adefam4gmail',
      },
      tls: {
        rejectunauthorized: false,
      },
    });
    const resetDetails = {
      from: '"ADEFAM Open Shop" <famosaade@gmail.com>',
      to: `${req.body.email}`,
      subject: 'Password Reset',
      text: 'Password Reset',
      html: output,
    };
    transporter.sendMail(resetDetails, (err, info) => {
      if (err) {
        console.log(err.message);
        return req.flash('error', 'Mail Sent Failed');
      }
      req.flash('success', 'Mail Sent');
      console.log(info);
      res.redirect('/login');
    });
  });
};

exports.confirmPasswordReset = async (req, res) => {
  // console.log(req.params);
  // const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  // const getParam = req.path.split('/');
  // const getResetKey = getParam[getParam.length-1];
  // if (!req.params.resetPasswordKey) {
  //   return res.redirect('/passwordresetemail');
  // }
  const getResetKey = req.params.resetPasswordKey;

  // console.log(getResetKey);

  const confirmKey = await User.findOne({
    where: { resetPasswordKey: getResetKey },
  });

  if (!confirmKey) {
    return res.redirect('/passwordresetemail');
  }
  // console.log(confirmKey);
  if (confirmKey.dataValues.resetPasswordKey !== getResetKey) {
    console.log('error');
    return res.send('Your session expire');
  }
  // console.log(getResetKey);

  res.render('newPassword.ejs', {
    getResetKey,
    getUsername: confirmKey.dataValues.username,
  });

  // console.log(fullUrl);
  // console.log(param);
};

exports.resetPassword = async (req, res, next) => {
  // return res.send('Rooute Working')
  const getResetKey = req.params.resetPasswordKey;
  if (getResetKey == null) {
    res.redirect('/login');
  }
  console.log(getResetKey);
  const { password, password2 } = req.body;
  if (password !== password2) {
    req.flash('error', 'Password do not match');
    res.render('newPassword.ejs');
  } else if (password.length < 8) {
    // Check password length
    req.flash('error', 'Password should be at least 8 characters');
    res.render('newPassword.ejs');
  }
  const findUser = await User.findOne({
    where: { resetPasswordKey: getResetKey },
  });
  const username = findUser.dataValues.email;
  const { resetPasswordKey } = findUser.dataValues;

  console.log(resetPasswordKey);
  User.resetPassword(username, password, resetPasswordKey, (err, user) => {
    if (err) {
      console.log(err.message);
      // res.redirect('/');
    }
    res.redirect('/login');
  });
};
