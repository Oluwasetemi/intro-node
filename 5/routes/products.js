const express = require('../../express');

const router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/', (req, res) => {
  res.send('products');
});

router.post('/', (req, res) => {
  res.send('post - products');
});

router.get('/:id', (req, res) => {
  res.send('get - products');
});

module.exports = router;
