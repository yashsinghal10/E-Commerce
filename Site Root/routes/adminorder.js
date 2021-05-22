var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Cart =  require('../models/cart');
var Order =  require('../models/order');
var Promise = require('promise');
var async = require('async');

router.get('/',function(req,res){
  Order.find({payment:"success",done:"No"},function(err,orders){
    res.render('./admin/admin_orders',{
      orders:orders
    });
  });
});
router.get('/:id',function(req,res){
    var id = req.params.id;
    Order.findOne({order_id:id},function(err,order){
      res.render('./admin/admin_singleorder',{
        order:order
      });
    });
});
router.get('/deleteorder/:id',function(req,res){
    var id = req.params.id;
    Order.findOne({order_id:id},function(err,o){
      o.done="Yes"
      o.save();
      });
    res.redirect('/admin/order');
});
// export
module.exports = router;
