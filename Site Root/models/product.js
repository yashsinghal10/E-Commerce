var mongoose = require('mongoose');

// Page schema
var ProductSchema = mongoose.Schema({
  title:{
    type:String,
    required:true
  },
    desc: {
        type: String,
        required: true
    },
    sorting: {
        type: Number
    },
    image:{
      type:String
    },
    price:{
      type: Number,
      required:true
    },
    category:{
      type:String,
      required:true
    }
});

var Product = mongoose.model('Product', ProductSchema);
 module.exports = Product;
