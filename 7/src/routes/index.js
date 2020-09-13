/* eslint-disable prettier/prettier */
const express = require('express');
const passport = require('passport');

const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const resetController = require('../controllers/resetController');

// const { ensureAuthenticated } = require('../config/auth');

// Testing Card Style sheet
router.get('/card', (req, res) => {
  res.render('card.ejs');
});

// Display home Page
// router.get('/', (req, res) => {
//   return res.render('display',
//     {
//       users: res.locals.user,
//       productDetail: res.locals.products,
//     }
//   );
// });

router.get(
  '/',
  productController.displayProduct,
);

// Product Route
router.get(
  '/products',
  authController.isLoggedIn,
  productController.productPage
);

// Product Route With Pagination

// Create Product
router.post(
  '/products',
  authController.isLoggedIn,
  productController.product
);

// Get product based on product Id
router.get(
  '/product/:productId',
  authController.isLoggedIn,
  productController.viewProductPage
);

// Get product based on users
router.get(
  '/productByUser',
  authController.isLoggedIn,
  productController.getProduct
);

router.get(
  '/productByUser/page/:pageNumber',
  authController.isLoggedIn,
  productController.getProduct
);

// Update Product
router.post(
  '/product/:productId',
  authController.isLoggedIn,
  // authController.isAuthurized,
  productController.editProduct
);

// Delete Product
router.delete(
  '/product/:productId',
  authController.isLoggedIn,
  productController.deleteProduct
);

router.get('/register', userController.registration);

router.post('/register', userController.register, authController.login);

router.get(
  '/dashboard',
  authController.isLoggedIn,
  userController.viewUser
);

router.get(
  '/users/:username',
  authController.isLoggedIn,
  userController.viewUsers
);

router.get(
  '/user/:username',
  authController.isLoggedIn,
  userController.viewUser
);

// Update User
router.post(
  '/user/:username',
  authController.isLoggedIn,
  // authController.isAuthurized,
  userController.editUser
);

// Delete User
router.delete(
  '/delete/:username',
  authController.isLoggedIn,
  userController.deleteUser
);

router.get('/login', authController.loginForm);

router.post('/login', authController.login);

// Logout Handler
router.get('/logout', authController.logout);

// Reset Password
router.get('/passwordresetemail', resetController.passwordReset);
router.post('/passwordresetemail', resetController.reset);

router.get(
  '/resetpassword/:resetPasswordKey',
  resetController.confirmPasswordReset
);

router.post('/resetpassword/:resetPasswordKey', resetController.resetPassword);

module.exports = router;
