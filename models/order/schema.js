const { ObjectID } = require("mongodb");
const mongoose = require("mongoose")

var OrderSchema = new mongoose.Schema({
    userid : {
        type: ObjectID,
        ref : "User"
    },
    depositBottle : {
        type : Number,
        default : 0
    },
    refillBottle : {
        type : Number,
        default : 0
    },
    dispenser : {
        type : Number,
        default : 0
    },
    orderDate : {
        type: String,
    },
    deliveryDate: {
        type: String
    },
    totalCost : {
        type : Number
    },
    address : {
        doorNumber : {
            type : String
        },
        street : {
            type : String
        },
        city : {
            type : String
        },
        pinCode : {
            type : String
        }
    },
    phoneNumber : {
        type : String,
        required :true
    }

});

module.exports = {OrderSchema}