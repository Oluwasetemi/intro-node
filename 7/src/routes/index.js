const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.get('/', (req, res) => {
  console.log(req.session);
  if (req.session.id && req.session.userId) {
    return res.redirect('dashboard');
  }
  return res.render('home.ejs');
});

router.get('/register', userController.homePage);

router.post('/register', userController.register);

router.get('/login', authController.loginForm);

router.post('/login', authController.login);

router.get('/dashboard', userController.dashboard);

module.exports = router;
