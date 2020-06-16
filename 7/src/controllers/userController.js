const user = require('../models/user');

exports.homePage = (req, res) => {
  res.render('register.ejs');
};

exports.register = async (req, res) => {
  try {
    // console.log(req.body);
    const [firstName, lastName] = req.body.name.split(' ');
    const { password, email } = req.body;
    console.log({ firstName, lastName, email, password });

    const createdUser = await user.create({
      firstName,
      lastName,
      email,
      password
    });

    console.log(createdUser);

    if (!createdUser) {
      res.send('Error: User could not be created');
    }

    res.render('dashboard.ejs', {
      firstName: createdUser.dataValues.firstName
    });
  } catch (error) {
    console.log(error.message);
    res.send('Error: User could not be created');
  }
};
