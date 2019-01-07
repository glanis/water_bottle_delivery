var mongoose = require("mongoose");
const validator = require('validator');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    balance: {
        type: Number,
        default: 0
    },
    token : {
        type : String
    },
    transactions: [{
        mode: {
            type: String,
            default: 'Debit',
        },
        amount: {
            type: String
        },
        date: {
            type: String,
            default: (new Date()).getTime()
        }
    }]
})

module.exports = { UserSchema }