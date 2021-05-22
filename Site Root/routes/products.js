var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var fs = require('fs-extra');

router.get('/', function (req, res) {
    Product.find({}).sort({sorting: 1}).exec(function (err, products) {
        res.render('products', {
            products: products,
            cat : "All Products"
        });
    });
});
router.get('/:cat', function (req, res) {
  var cat = req.params.cat;
    Product.find({category: cat},function(err,products){
      if(err){
        console.log(err);
      }
      else{
        res.render('products',{
          products: products,
          cat : cat
        });
      }
    });
});
router.get('/:title/:cat',function(req,res){
  var  galleryImages = null;
  var title = req.params.title;
  Product.findOne({title: title},function(err,product){
    if(err){
      console.log(err);
    }
    else{
       var galleryDir = 'public/product-images/' + product.title + '/gallery/';
      fs.readdir(galleryDir,function(err,files){
        if(err){
          console.log(err);
        }
         galleryImages = files;
        res.render('product', {
                       title: product.title,
                       p: product,
                         galleryImages:  galleryImages
                   });
      });
    }
  });
});
// export
module.exports = router;
