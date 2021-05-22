var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Cart =  require('../models/cart');
var Order =  require('../models/order');
var Razorpay = require('razorpay');
var Promise = require('promise');
var async = require('async');

//razorpay instance
var razorpay = new Razorpay({
  key_id: 'rzp_test_FtJJeKSs2gOIpy',
  key_secret: 'jEt2fn95X5bn8UpWBLR7BzIW',
});
router.post('/orderamount',function(req,res){
  var carttotal=0;
  var shiptotal = 0;
  var finaltotal = 0;
  Cart.aggregate([{
    $group: {
        _id: null,
        carttotal: {
            $sum: "$total"
        }
    }
}])
.then(res=>{
  carttotal=Number(res[0].carttotal);
  shiptotal = 60;
  finaltotal = Number(carttotal) + Number(shiptotal);
   console.log(finaltotal);
   var options = {
    amount: Number(finaltotal)*Number(100),  // amount in the smallest currency unit
    currency: "INR",
    receipt: "xyz"
  };
  razorpay.orders.create(options, function(err, order) {
    if(err){
      console.log(err);
    }
    else{
    console.log(order);
    var orders = new Order({
      total : order.amount,
      order_id: order.id,
      done:"No"
    });
       orders.save();
  }
 });
});
 res.redirect('/order/orderdetail');
});

router.get('/orderdetail',function(req,res){
  var carttotal= 0;
  var shiptotal = 0;
  var finaltotal = 0;
  Cart.aggregate([{
    $group: {
        _id: null,
        carttotal: {
            $sum: "$total"
        }
    }
}])
.then(res=>{
  carttotal=Number(res[0].carttotal);
  shiptotal = 60;
  finaltotal = Number(carttotal) + Number(shiptotal);
  });
  Cart.find({}).sort({sorting: 1}).exec(function (err, products) {
    if(err){
      console.log(err);
    }
    else{
      res.render('order', {
          carttotal:carttotal,
          shiptotal:shiptotal,
          finaltotal:finaltotal
      });
    }
  });
});
router.post('/orderdetail',function(req,res){
  var firstname = req.body.fname;
  var lastname = req.body.lname;
  var email = req.body.email;
  var num = req.body.mob;
  var address = req.body.address;
  var country = req.body.country;
  var city = req.body.city;
  var state = req.body.state;
  var pin = req.body.pin;
  Cart.find({}).sort({sorting: 1}).exec(function (err, products){
    if(err){
      console.log(err);
    }
  //  limit(1).sort({$natural:-1})
  Order.findOne({}).sort({_id:-1}).limit(1).exec(function (err,o) {
    if(err){
      console.log(err);
    }
    else{
          o.firstname=firstname,
          o.lastname=lastname,
          o.email= email,
          o.num = num,
          o.address = address,
          o.country = country,
          o.state = state,
          o.city = city,
          o.pin = pin,
          o.products=products
          o.save(function(err){
              if(err){
                console.log(err);
              }
          });
        }
  });
});
  res.redirect('/order/ordercheckout');
});
router.get('/ordercheckout',function(req,res){
  var carttotal= 0;
  var shiptotal = 0;
  var finaltotal = 0;
  Cart.aggregate([{
    $group: {
        _id: null,
        carttotal: {
            $sum: "$total"
        }
    }
}])
.then(res=>{
  carttotal=Number(res[0].carttotal);
  shiptotal = 60;
  finaltotal = Number(carttotal) + Number(shiptotal);
  });
    Order.findOne({}).sort({_id:-1}).limit(1).exec(function (err,o) {
  Cart.find({}).sort({sorting: 1}).exec(function (err, products) {
    if(err){
      console.log(err);
    }
    else{
      res.render('checkout', {
          carttotal:carttotal,
          shiptotal:shiptotal,
          finaltotal:finaltotal,
          firstname:o.firstname,
          lastname:o.lastname,
          email: o.email,
          num : o.num,
          address : o.address,
          country : o.country,
          state : o.state,
          city : o.city,
          pin : o.pin,
          order:o
      });
    }
  });
  });
});
router.post('/confirm',function(req,res){
  var p_id = req.body.razorpay_payment_id;
  var o_id = req.body.razorpay_order_id;
  var sign = req.body.razorpay_signature;
 razorpay.payments.fetch(req.body.razorpay_payment_id).then((payment)=>{
        if(payment.status=='captured'){
            Order.findOne({order_id:o_id},function(err,o){
              o.pay_id=  p_id,
              o.payment_sign = sign,
              o.payment = "success"
              o.save();
            });
            res.redirect('/order/success');
        }
        else{
          Order.findOne({order_id:o_id},function(err,o){
            o.payment = "failure"
            o.save();
          });
          res.redirect('/order/failure');
        }
  });
});
router.get('/success',function(req,res){
  res.render('success');
});
router.get('/failure',function(req,res){
  res.render('failure');
});

// export
module.exports = router;
