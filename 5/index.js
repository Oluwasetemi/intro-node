const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const express = require('../express');
const users = require('./users');
const products = require('./products');
const orders = require('./orders');

const app = express();

const myLogger = function(req, res, next) {
  console.log('2nd LOGGED');
  next();
};

const requestTime = function(req, res, next) {
  req.requestTime = Date.now();
  next();
};

function timeLog(req, res, next) {
  console.log('1st Time: ', Date.now());
  next();
}
// public configuration
app.use(express.static(path.join(__dirname, 'public')));

// view configuration
app.engine('pug', require('pug').__express);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(requestTime);
// middleware that is specific to this router
app.use(timeLog);
app.use(myLogger);

// parses request cookies, populating
// req.cookies and req.signedCookies
// when the secret is passed, used
// for signing the cookies.
app.use(cookieParser('my secret here'));

// parses x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// routes
app.use('/users', users);
app.use('/products', products);
app.use('/orders', orders);

// error handling
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(501).send('Something broke!');
});

// home page
app.get('/', (req, res) => {
  if (req.cookies.remember) {
    res.send('Remembered :). Click to <a href="/forget">forget</a>!.');
  } else {
    res.send(
      '<form method="post"><p>Check to <label>' +
        '<input type="checkbox" name="remember"/> remember me</label> ' +
        '<input type="submit" value="Submit"/>.</p></form>'
    );
  }
});

app.get('/forget', function(req, res) {
  res.clearCookie('remember');
  res.redirect('back');
});

app.post('/', function(req, res) {
  const minute = 60000;
  if (req.body.remember) res.cookie('remember', 1, { maxAge: minute });
  res.redirect('back');
});

app.get('/home', (req, res) => {
  res.render('home.pug', {
    title: 'Hey',
    name: 'Oluwasetemi',
    message: "You're doing well Oo..in"
  });
});

app.get('/another', (req, res) => {
  res.render('another.pug');
});

/**
 * Starting with Express 5, route handlers and middleware that return a Promise will call next(value) automatically when they reject or throw an error.
 *
 */
/* app.get('*', (req, res, next) => {
// throw new Error('BROKEN'); // Express will catch this on its own.
// fs.readFile('/file-does-not-exist', function(err, data) {
//   if (err) {
//     next(err); // Pass errors to Express.
//   } else {
//     res.send(data);
//   }
// });

// next(err) // passes error to express
// setTimeout(function() {
//   try {
//     throw new Error('BROKEN');
//   } catch (err) {
//     console.log(err.message);
//     next(err);
//   }
// });

Promise.resolve()
  .then(function() {
    throw new Error('BROKEN');
  })
  .catch(next); // Errors will be passed to Express.
}); */

// server listening
app.listen(3000, () => {
  console.log(`App listening on port http://localhost:3000!`);
});
