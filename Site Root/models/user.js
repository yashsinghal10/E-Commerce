var mongoose = require('mongoose');

// Page schema
var UserSchema = mongoose.Schema({
  email:{
    type:String,
    required:true
  },
    password: {
        type: String,
        required: true
    },
    admin:{
      type:Number,
      required:true
    }
});

var User = mongoose.model('User', UserSchema);
 module.exports = User;
