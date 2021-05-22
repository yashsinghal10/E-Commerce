var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Cart =  require('../models/cart');
router.get('/',function(req,res){
  console.log(req.profile);
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
});
  Cart.find({}).sort({sorting: 1}).exec(function (err, products) {
    if(err){
      console.log(err);
    }
    else{
      res.render('cart', {
          products: products,
          carttotal:carttotal,
          shiptotal:shiptotal,
          finaltotal:finaltotal,
          user:req.user
      });
    }
  });
});
router.get('/:title/', function(req,res){
   var title = req.params.title;
   Product.findOne({title:title},function(err,p){
     if(err){
       console.log(err);
     }
     else{
       Cart.findOne({title:title},function(err,product){
         if(err){
           console.log(err);
         }
         else{
         if(product){
         Cart.findOneAndUpdate( {title: product.title},
      {$inc : {'quantity' : 1,'total':product.price}},
      {new: true},
      function(err, res) {
           // do something
           console.log("done");
     });
      res.redirect('back');
         }
         else{
           var cart = new Cart({
             title: p.title,
             image: p.image,
             price: p.price,
             total: p.price,
             quantity:1,
             sorting:100
           });
           cart.save();
           console.log("added");
           res.redirect('back');
         }
       }
       });
     }
   });
});
router.get('/buy/:title/', function(req,res){
   var title = req.params.title;
   Product.findOne({title:title},function(err,p){
     if(err){
       console.log(err);
     }
     else{
       Cart.findOne({title:p.title},function(err,product){
         if(err){
           console.log(err);
         }
         else{
         if(product){
         Cart.findOneAndUpdate( {title: product.title},
      {$inc : {'quantity' : 1,'total':product.price}},
      {new: true},
      function(err, res) {
           // do something
           console.log("done");
     });
      res.redirect('/cart/');
         }
         else{
           var cart = new Cart({
             title: p.title,
             image: p.image,
             price: p.price,
              total: p.price,
             quantity:1,
             sorting:100
           });
           cart.save();
           console.log("added");
           res.redirect('/cart/');
         }
       }
       });
     }
   });
});
router.get('/increase/:title',function(req,res){
  var title = req.params.title;
  Product.findOne({title:title},function(err,product){
  Cart.findOneAndUpdate( {title:title},
{$inc : {'quantity' : 1,'total':product.price}},
{new: true},
function(err, res) {
    // do something
    console.log("done");
});
});
res.redirect('/cart/');
});

router.get('/decrease/:title',function(req,res){
  var title = req.params.title;
    Product.findOne({title:title},function(err,product){
  Cart.findOneAndUpdate( {title:title},
{$inc : {'quantity' : -1,'total':-product.price}},
{new: true},
function(err, res) {
    // do something
    console.log("done");
});
});
res.redirect('/cart/');
});
router.get('/delete/:title',function(req,res){
  var title = req.params.title;
   Cart.findOne({title:title},function(err,p){
     p.remove();
   });
   console.log("item removed");
res.redirect('/cart/');
});

router.get('/delete',function(req,res){
 Cart.remove({});
res.redirect('back');
});

// export
module.exports = router;
