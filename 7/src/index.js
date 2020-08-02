require('dotenv').config({ path: 'variables.env' });
const express = require('express');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const methodOverride = require('method-override'); // To delete and update using Sequelize
const flash = require('express-flash'); // request for flash module of message
const passport = require('passport'); // Passport for authentication

const path = require('path');
const { promisify } = require('es6-promisify');
const { sequelize } = require('./db');
const routes = require('./routes');
const Session = require('./models/session');
const User = require('./models/user');
const Product = require('./models/product');
const errorHandlers = require('./util/errorhandler');
const helpers = require('./util/helpers');

require('./util/passport');

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
app.use(cookieParser());

const sessionStore = new SequelizeStore({
  db: sequelize,
});

// Populates req.session
app.use(
  session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    key: process.env.KEY,
    name: 'adefams_shop',
    secret: process.env.TOKEN_SECRET,
    store: sessionStore,
  })
);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

sessionStore.sync();

// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.flashes = req.flash();
  res.locals.user = req.user || null;
  res.locals.products = req.products || [];
  res.locals.currentPath = req.path;
  next();
});

// promisify some callback based APIs
app.use((req, res, next) => {
  req.logIn = promisify(req.logIn, req);
  next();
});

// public configuration
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Middleware for file upload
app.use(fileUpload()); // configure fileupload

// MethodOverride Middleware for delete route
app.use(methodOverride('_method'));

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

app.get('*', (req, res, next) => {
  // req.flash('error: No Page found')
  req.flash('Error: No such page found, please check ur URL');
  next();
});

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.flashValidationErrors);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

// done! we export it so we can start the site in start.js
module.exports = app;

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `App listening on port http://localhost:${process.env.PORT || 3000}!`
  );
});
