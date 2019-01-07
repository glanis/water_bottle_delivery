const _ = require('lodash');

const { User } = require('../models/user/index');
const { getFormattedDate } = require('../utils/date_format')
const {Order} = require('../models/order/index');


module.exports = (function () {
    return {
        //user registers by sending username, email and password in the request & receives a JWT
        
        userRegister: function (req, res) {
            var body = _.pick(req.body, ['username', 'email', 'password', 'confirm']);
            User.findOne({ email: body.email }).then((user) => {
                if (user) {
                    res.status(400).send({ "message": "email id is already existing" })
                }
            }).catch((e) => {
                res.status(400).send(e)
            })
            if (body.password !== body.confirm) {
                res.status(400).send({ "message": "password and confirm password doesn't match" });
            }
            else {
                var user = new User(body);
                user.balance = 0;
                user.generateAuthToken().then((token) => {
                    user.token = token
                    res.send(user)
                }).catch((e) => {
                    res.status(400).send(e)
                });
            }

        },

        //user logins and receives a JWT from the server

        userLogin: function (req, res) {
            var body = _.pick(req.body, ['email', 'password']);

            User.findByLogin(body.email, body.password).then((user) => {
                return user.generateAuthToken().then((token) => {
                    user.token = token;
                    res.send(user)

                });
            }).catch((e) => {
                res.status(400).send();
            });
        },

        //user adds currency to his/her wallet by sending amount in request

        recharge: function (req, res) {
            var body = _.pick(req.body, ["amount"]);
            var token = req.header('Authorization');
            User.findByToken(token).then((user) => {
                if (user) {
                    if (body.amount > 0) {
                        user.balance += body.amount;
                        var transaction = { "mode": "credit", "amount": body.amount, "date": getFormattedDate() };
                        user.transactions.push(transaction);
                        user.save();
                        res.send(user)
                    }
                    res.status(400).send({ "message": "negative amount is invalid" })
                }
            }).catch((e) => {
                res.status(400).send({ "message": "login again" })
            });
        },

        //User can view his emailID,username and wallet balance.

        userProfile: function (req, res) {
            var token = req.header('Authorization');

            User.findByToken(token).then((user) => {
                if (user) {
                    res.send(user)
                }
            }).catch((e) => {
                res.status(400).send({ "message": "login again" })
            });
        },

        //user can view only their order history

        userOrders: function (req, res) {
            var token = req.header('Authorization');
            User.findByToken(token).then((user) => {
                if (user) {
                    Order.find({ userid: user._id }).then((orders) => {
                            res.send(orders)
                    }).catch((e) => {
                        res.status(400).send({ "message": "no orders from this user" });                    })
                }
            }).catch((e) => {
                res.status(400).send({ "message": "login again" })
            });
        },

        //user can view the transactions made to/from the account i.e, DEBIT or CREDIT

        userTransactions: function (req, res) {
            var token = req.header('Authorization');
            User.findByToken(token).then((user) => {
                res.send(user.transactions);
            }).catch((e) => {
                res.status(400).send({ "message": "login again" })
            });
        }

    }
}());