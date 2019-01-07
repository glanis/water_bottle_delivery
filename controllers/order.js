const _ = require('lodash');


const { User } = require('../models/user/index');
const { Order } = require('../models/order/index');
const { getFormattedDate } = require('../utils/date_format')

module.exports = (function () {
    return {

        //user can post their orders by sending all the necessary details in the request body 

        postOrder: function (req, res) {
            var token = req.header('Authorization');
            User.findByToken(token).then((user) => {
                if (!user) {
                    res.status(400).send("login needed")
                }
                var body = _.pick(req.body, ['depositBottle', 'refillBottle', 'dispenser', 'deliveryDate', 'address', "phoneNumber"])
                var order = new Order(body);
                order.orderDate = getFormattedDate();
                if (body.deliveryDate > new Date(Date.now()).toLocaleString()) {
                    order.deliveryDate = body.deliveryDate;
                }
                else {
                    res.status(400).send({ "message": "delivery date cannot be older than order date" })
                }
                order.totalCost = (body.depositBottle * 15) + (body.refillBottle * 8 + body.dispenser * 400);
                if (user.balance < order.totalCost) {
                    res.status(400).send({ "message": " you dont have sufficient balance in your wallet. Please recharge it" })
                }
                else {
                    user.balance = user.balance - order.totalCost
                    order.userid = user._id
                    var transaction = { "mode": "Debit", "amount": order.totalCost, "date": getFormattedDate() };
                    user.transactions.push(transaction);

                    user.save();
                    order.save();
                }

                res.send(order);
            }).catch((e) => {
                res.status(400).send(e);
            });

        },

        updateOrder: function (req, res) {
            var token = req.header('Authorization');
            User.findByToken(token).then((user) => {
                var body = _.pick(req.body, ['depositBottle', 'refillBottle', 'deliveryDate', 'dispenser']);
                Order.findById(req.params.id).then((order) => {
                    if (order) {
                        var totalCost = (body.depositBottle * 15) + (body.refillBottle * 8 + body.dispenser * 400);

                        var difference = order.totalCost - totalCost;

                        if (difference < 0) {
                            if (user.balance > difference)
                                user.balance = user.balance - difference;
                            else
                                res.status(400).send("no proper balance");
                            var transaction = { "mode": "Debit", "amount": totalCost, "date": getFormattedDate() };
                            user.transactions.push(transaction);
                        }
                        else {
                            user.balance = user.balance + difference;

                            var transaction = { "mode": "Credit/Refund", "amount": difference, "date": getFormattedDate() };
                            user.transactions.push(transaction);
                            user.save();
                            order.save()

                        }
                        order.totalCost = totalCost;
                        Order.findByIdAndUpdate(req.params.id, {
                            $set: {
                                "depositBottle": body.depositBottle,
                                "refillBottle": body.refillBottle,
                                "dispenser": body.dispenser
                            }}, {upsert: true}
                        ).then((order) => {
                            res.send(order);
                        }).catch((e) => {
                            res.status(400).send("could not update");
                        });
                    }
                }).catch(() => {
                    res.status(400).send("invalid id");
                });
            }).catch(() => {
                res.status(400).send("login needed")
            })
        }
    }
}());