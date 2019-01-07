const express = require('express');
const userController = require('../controllers/user')
const orderController = require('../controllers/order')

const router = express.Router();

module.exports = function (app) {
    router.post('/', orderController.postOrder);

    router.post('/update/:id', orderController.updateOrder);

    app.use('/order', router);
}
