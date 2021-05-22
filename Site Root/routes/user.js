var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcryptjs');
var User = require('../models/user');
var alert= require('alert');

router.get('/register_login', function(req,res){
   res.render('register_login');
});
router.post('/register', function(req,res){
   var email1 = req.body.email1;
   var password1 = req.body.password1;
   User.findOne({email:email1},function(err,user){
     if(err){
       console.log(err);
     }
     if(user){
       alert('User Already Exists!!')
       res.redirect('/user/register_login');
     }
     else{
       var user = new User({
         email : email1,
         password:password1,
         admin:1
       });
       bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(user.password, salt, function (err, hash) {
                        if (err){
                            console.log(err);
                          }
                        user.password = hash;
                        user.save();
     });
   });
   res.redirect('/user/register_login');
 }
   });
});
router.post('/login', function (req, res, next) {

    passport.authenticate('local',{
        successRedirect: '/',
        failureRedirect: '/user/register_login',
        failureFlash: 'Invalid username or password.'
    })(req, res, next);
});
// export
module.exports = router;
