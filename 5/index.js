const cookieParser = require('cookie-parser');
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

// routes
app.use('/users', users);
app.use('/products', products);
app.use('/orders', orders);

// server listening
app.listen(3000, () => {
  console.log(`App listening on port http://localhost:3000!`);
});
