const express = require('express');
const passport = require('passport')

const router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const productController = require('../controllers/productController')

const {ensureAuthenticated} = require('../config/auth')


// Testing Card Style sheet
router.get('/card', (req, res) => {
  res.render('card.ejs')
})


// Display home Page
// router.get('/', (req, res) => {
//   // console.log(req.session);
//   // if (req.session.id && req.session.userId) {
//   //   return res.redirect('dashboard');
//   // }

//   // req.flash('success', 'Welcome to Home Page Flash');

//   //  render to views/home.ejs
//   return res.render('home');
// });

router.get('/register', userController.homePage);

// Product Route
router.get('/products',  authController.isLoggedIn, productController.productPage);

router.get('/dashboard',  authController.isLoggedIn, productController.getProduct);
router.get('/dashboard/page/:pageNumber',  productController.getProduct); //Product Route With Pagination

// Get product based on product Id
router.get('/product/:productId', authController.isLoggedIn,productController.viewProductPage);

// Create Product
router.post('/products', authController.isLoggedIn, productController.product);

// Update Product
// router.put('/product/:productId', productController.editProduct);
router.post('/product/:productId', productController.editProduct);


// Delete Product
router.delete('/product/:productId', ensureAuthenticated, productController.deleteProduct);

// Display Product
router.get('/', productController.getProduct);


router.post('/register', userController.register, authController.login);

router.get('/login', authController.loginForm);

router.post('/login',authController.login);

// router.get('/dashboard', authController.isLoggedIn, userController.dashboard);

// Logout Handler
router.get('/logout', authController.logout)


module.exports = router;
