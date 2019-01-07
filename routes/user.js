const express = require('express');
const userController = require('../controllers/user')

const router = express.Router();

module.exports = function (app) {
router.post('/register', userController.userRegister);
router.post('/login', userController.userLogin);
router.post('/recharge', userController.recharge);
router.get('/', userController.userProfile);
router.get('/orders', userController.userOrders);
router.get('/transactions', userController.userTransactions);

app.use('/user', router);

}