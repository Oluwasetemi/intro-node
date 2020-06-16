const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

router.get('/', (req, res) => {
  res.render('home.ejs');
});

router.get('/register', userController.homePage);

router.post('/register', userController.register);

module.exports = router;
