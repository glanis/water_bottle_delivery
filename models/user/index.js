const _ = require('lodash');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const mongoose = require("mongoose")

const { UserSchema } = require('./schema');
const { SECURITY_KEY } = require('./../../config')

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
    if (_.pick(userObject, ["token"]))
        return _.pick(userObject, ["email", "username", "balance", "token"]);
    return _.pick(userObject, ["email", "username", "balance"]);
}

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var token = jwt.sign({ _id: user._id.toHexString() }, 'SECURITY_KEY').toString();
    return user.save().then(() => {
        return token;
    }).catch((e) => {
        Promise.reject()
    });
};

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;
    try {
        decoded = jwt.verify(token, 'SECURITY_KEY');
    } catch (e) {
        return Promise.reject();
    }
    return User.findOne({
        '_id': decoded._id
    });
};

UserSchema.statics.findByLogin = function (email, password) {
    var User = this;

    return User.findOne({ email }).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            // Use bcrypt.compare to compare password and user.password
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    }).catch((e) => {
        console.log("error");
    });
};


UserSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = { User }