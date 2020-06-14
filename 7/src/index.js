require('dotenv').config({ path: 'variables.env' });
const express = require('express');

const path = require('path');
const Sequelize = require('sequelize');

const app = express();

// setup database
// Option 1: Passing parameters separately
const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DBUSER,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: 'mysql',
    define: {
      // The `timestamps` field specify whether or not the `createdAt` and `updatedAt` fields will be created.
      // This was true by default, but now is false by default
      timestamps: true
    }
  }
);

exports.sequelize = sequelize;

// test connections
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const user = require('./models/user');

// parses x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// public configuration
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// view configuration
// app.engine('ejs', require('ejs').__express);

app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('home.ejs');
});

app.get('/register', (req, res) => {
  res.render('register.ejs');
});

app.post('/register', async (req, res) => {
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
});

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});
