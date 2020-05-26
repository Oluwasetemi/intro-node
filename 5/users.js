const cookieSession = require('cookie-session');
const express = require('../express');

const router = express.Router();

// add req.session cookie support
router.use(cookieSession({ secret: 'manny is cool' }));

// do something with the session
router.use(count);

// custom middleware
function count(req, res) {
  req.session.count = (req.session.count || 0) + 1;
  res.send(`viewed ${req.session.count} times\n`);
}

// router.get('/', count);

router.post('/', (req, res) => {
  res.send('post - users');
});

router.get('/:id', (req, res) => {
  res.send('get - users');
});

module.exports = router;
