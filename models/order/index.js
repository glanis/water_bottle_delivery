const _ = require('lodash');
const mongoose = require("mongoose")

const { OrderSchema } = require('./schema');

OrderSchema.methods.toJSON = function () {
    var order = this;
    var orderObject = order.toObject();

    return _.pick(orderObject, ["userid", "depositBottle", "refillBottle", "dispenser", "address", "totalCost", "orderDate", "deliveryDate"]);
}

var Order = mongoose.model('Order', OrderSchema);

module.exports = {Order}