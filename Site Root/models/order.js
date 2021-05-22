var mongoose = require('mongoose');
var Cart = require('../models/cart');
const { ObjectId } = mongoose.Schema;
var OrderSchema = mongoose.Schema({
    sorting: {
        type: Number
    },
    total:{
      type: Number,
      required:true
    },
    order_id:{
      type:String,
      required:true
    },
    firstname:{
      type:String
    },
    lastname:{
      type:String
    },
    email:{
      type:String
    },
    address:{
      type:String
    },
    state:{
      type:String
    },
    country:{
      type:String
    },
    city:{
      type:String
    },
    num:{
      type:Number
    },
    pin:{
      type:Number
    },
    products:{
      type: Array,
    },
    payment:{
        type:String
    },
    pay_id:{
      type:String
    },
    payment_sign:{
        type:String
    },
    done:{
      type:String,
      required:true
    }
});

var Order = mongoose.model('Order', OrderSchema);
 module.exports = Order;
