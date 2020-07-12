require('dotenv').config({ path: 'variables.env' });
const express = require('express');
const fileUpload = require('express-fileupload')
const methodOverride = require('method-override') //To delete and update using Sequelize 
const flash = require('express-flash') //request for flash module of message

const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { sequelize } = require('./db');
const routes = require('./routes');
const Session = require('./models/session');
const User = require('./models/user');
const Product = require('./models/product');

const app = express();

// Flash MiddleWare
app.use(flash());

// parses x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// parses request cookies, populating
// req.cookies and req.signedCookies
// when the secret is passed, used
// for signing the cookies.
app.use(cookieParser(process.env.TOKEN_SECRET));

const sessionStore = new SequelizeStore({
  db: sequelize
});

// Populates req.session
app.use(
  session({
    resave: true, // don't save session if unmodified
    saveUninitialized: true, // don't create session until something stored
    secret: process.env.TOKEN_SECRET,
    store: sessionStore
  })
);

sessionStore.sync();

function loggedOut(req, res, next) {
  if (req.session && req.session.userId) {
    return res.redirect('/dashboard');
  }
  return next();
}

function requiresLogin(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  const err = new Error('You must be logged in to view this page');
  err.status = 401;
  return next(err);
}

// Make userId available in templates
  // app.use(function(req, res, next) {
  //   res.locals.currentUser = req.session.userId;
  //   next();
  // });

// Make userId available in templates
    // app.use(async function(req, res, next) {
    //   if (req.session && req.session.userId) {
    //     // populate the user field
    //     const userData = await User.findOne({ where: { id: req.session.userId } });
    //     res.locals.user = userData;
    //     next();
    //   }
    // });

// public configuration
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.use(fileUpload()); // configure fileupload

// MethodOverride Middleware
app.use(methodOverride('_method'))

// view configuration
app.engine('ejs', require('ejs').__express);
// OR
// app.engine('html', require('ejs').renderFile);
// set default engine
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// Router handler
app.use('/', routes);

app.get('*', (req, res) => {
  // req.flash('error: No Page found')
  res.send(req.flash('Error: No such page found, please check ur URL'))
})

// error handler

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `App listening on port http://localhost:${process.env.PORT || 3000}!`
  );
});
