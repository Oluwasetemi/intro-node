const express = require('../../express');

const users = require('../routes/users');
const products = require('../routes/products');
const orders = require('../routes/orders');

const router = express.Router();

// routes
router.use('/users', users);
router.use('/products', products);
router.use('/orders', orders);

module.exports = router;
