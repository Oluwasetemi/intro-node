/* eslint-disable no-shadow */
const user = require('../models/user');
const { hash } = require('../util/helpers');
const { send } = require('../util/mail');

exports.homePage = (req, res) => {
  res.render('register.ejs');
};

exports.register = async (req, res) => {
  try {
    // console.log(req.body);
    const [firstName, lastName] = req.body.name.split(' ');
    const { password, email } = req.body;
    // console.log({ firstName, lastName, email, password });

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
      password: hashedPassword
    });

    // console.log(createdUser);

    if (!createdUser) {
      res.send('Error: User could not be created');
    }

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

    await send({
      filename: 'welcome-to-adefam',
      to: createdUser.email,
      subject: 'Registration Successful',
      name: createdUser.firstName
    });

    res.render('dashboard.ejs', {
      firstName: createdUser.dataValues.firstName
    });
  } catch (error) {
    console.log(error.message);
    res.send('Error: User could not be created');
  }
};

exports.dashboard = (req, res) => {
  const { user } = res.locals;
  res.render('dashboard', { firstName: user.firstName });
};
