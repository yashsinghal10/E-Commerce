var mongoose = require('mongoose');

// Page schema
var CartSchema = mongoose.Schema({
  title:{
    type:String,
    required:true
  },
    sorting: {
        type: Number
    },
    price: {
        type: Number,
        required:true
    },
    quantity: {
        type: Number,
        required:true
    },
    image:{
      type:String
    },
    total:{
      type: Number,
      required:true
    }
});

var Cart = mongoose.model('Cart', CartSchema);
 module.exports = Cart;
