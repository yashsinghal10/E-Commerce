var mongoose = require('mongoose');

// Page schema
var CategorySchema = mongoose.Schema({
  title:{
    type:String,
    required:true
  },
    sorting: {
        type: Number
    }
});

var Category = mongoose.model('Category', CategorySchema);
 module.exports = Category;
