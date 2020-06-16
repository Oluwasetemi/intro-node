const cookieSession = require('cookie-session');
const express = require('../../express');

const router = express.Router();

// add req.session cookie support
router.use(cookieSession({ secret: 'manny is cool' }));

// custom middleware
function count(req, res, next) {
  req.session.count = (req.session.count || 0) + 1;
  next();
}

// do something with the session
router.use(count);

// predicate the router with a check and bail out when needed
router.use(function(req, res, next) {
  // NOTE: next('router') - To skip the rest of the router’s middleware functions, call next('router') to pass control back out of the router instance.
  if (!req.headers['x-auth']) return next('router');
  next();
});

function logOriginalUrl(req, res, next) {
  console.log('Request URL:', req.originalUrl);
  next();
}

function logMethod(req, res, next) {
  console.log('Request Type:', req.method);
  next();
}

const logStuff = [logOriginalUrl, logMethod];

router.get('/', count, (req, res) => {
  res.send(`viewed ${req.session.count} times\n`);
});

router.post('/', (req, res) => {
  res.send('post - users');
});

// contains a middleware that passes the control to the next matching route
router.get(
  '/:id',
  logStuff,
  (req, res, next) => {
    // if the user ID is 0, skip to the next route
    // NOTE: next('route') - calls the next route path matching parent route path using middleware
    if (req.params.id === '0') next('route');
    // otherwise pass the control to the next middleware function in this stack
    else next();
  },
  function(req, res, next) {
    // send a regular response
    res.send('regular');
  }
);

// handler for the /user/:id path, which sends a special response
router.get('/:id', function(req, res, next) {
  res.send('special');
});

router.patch('/:id', (req, res) => {
  res.send('PAtch 🆔 users');
});

module.exports = router;
