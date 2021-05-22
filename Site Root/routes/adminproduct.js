var express = require('express');
var router = express.Router();
var fs= require('fs');
var mkdirp = require('mkdirp');
var resizeImg = require('resize-img');
var alert = require("alert");
var windows = require("window");

var Product = require('../models/product');
var Category = require('../models/category');

router.get('/', function (req, res) {
    Product.find({}).sort({sorting: 1}).exec(function (err, products) {
        res.render('./admin/admin_product', {
            products: products
        });
    });
});
router.get('/addproduct',function(req,res){
  var title = "";
  var desc = "";
  var price= "";
  Category.find(function(err,categories){
    res.render('./admin/admin_addproduct',{
      title : title,
      desc : desc,
      price: price,
      categories: categories
    });
  });
});
router.post('/addproduct',function(req,res){
  var imageFile;
  if(req.files){
    imageFile = req.files.image.name;
  }
  else{
    imageFile="";
  }
  var title = req.body.title;
  var desc = req.body.desc;
  var price = req.body.price;
  var category = req.body.category;
  Product.findOne({title:title},function(err,produc){
    if(err){
      return console.log(err);
    }
    else{
      if(produc){
      alert("Product Title already exist! Try with a different one");
      }
      else{
        var product = new Product({
          title: title,
          desc: desc,
          image: imageFile,
          price: price,
          category: category
        });
        product.save(function (err) {
                    if (err)
                        return console.log(err);

                    mkdirp('public/product-images/' + product.title);

                    mkdirp('public/product-images/' + product.title + '/gallery');

                    mkdirp('public/product-images/' + product.title + '/gallery/thumbs');

                    //mkdirp('public/product-images/' + product.title  );


                    if (imageFile != "") {
                        var productImage = req.files.image;
                        var path = 'public/product-images/' + product.title + '/' + imageFile;

                        productImage.mv(path, function (err) {
                            return console.log(err);
                        });
                    }
      });
    }
  }
});
  res.redirect('/admin/product');
});
router.get('/editproduct/:id',function(req,res){
  var errors;

  if (req.session.errors)
      errors = req.session.errors;
  req.session.errors = null;

  Category.find(function (err, categories) {

      Product.findById(req.params.id, function (err, p) {
          if (err) {
              console.log(err);
              res.redirect('/admin/product');
          } else {
              var galleryDir = 'public/product-images/' + p.title + '/gallery';
              var galleryImages = null;

              fs.readdir(galleryDir, function (err, files) {
                  if (err) {
                      console.log(err);
                  } else {
                      galleryImages = files;

                      res.render('admin/admin_editproduct', {
                          title: p.title,
                          errors: errors,
                          desc: p.desc,
                          categories: categories,
                          category: p.category,
                          price: p.price,
                          image: p.image,
                          galleryImages: galleryImages,
                          id: p._id
                      });
                  }
              });
          }
      });

  });
});
router.post('/editproduct/:id',function(req,res){
  var imageFile;
  if(req.files){
    imageFile = req.files.image.name;
  }
  else{
    imageFile="";
  }

     var title = req.body.title;
     var desc = req.body.desc;
     var price = req.body.price;
     var category = req.body.category;
     var pimage = req.body.pimage;
     var id = req.params.id;

                 Product.findById(id, function (err, p) {
                     if (err)
                         console.log(err);

                     p.title = title;
                     p.desc = desc;
                     p.price = price;
                     p.category = category;
                     if (imageFile != "") {
                         p.image = imageFile;
                     }

                     p.save(function (err) {
                         if (err)
                             console.log(err);
                             if (imageFile != "") {
                                                        if (pimage != "") {
                                                            fs.unlink('public/product-images/' + title + '/' + pimage, function (err) {
                                                                if (err)
                                                                    console.log(err);
                                                            });
                                                        }


                             var productImage = req.files.image;
                             var path = 'public/product-images/' + title + '/' + imageFile;

                             productImage.mv(path, function (err) {
                                 return console.log(err);
                             });
}
                         });
                         res.redirect('/admin/product/');
                     });

                 });
 router.post('/productgallery/:title', function (req, res) {

 var title = req.params.title;
              if(req.files.file1){
                var productImage1 = req.files.file1;
                var path1 = 'public/product-images/' + title + '/gallery/' + req.files.file1.name;
                var thumbsPath1 = 'public/product-images/' + title + '/gallery/thumbs/' + req.files.file1.name;

                productImage1.mv(path1, function (err) {
                        console.log(err);
                        resizeImg(fs.readFileSync(path1), {width: 100, height: 100}).then(function (buf) {
                            fs.writeFileSync(thumbsPath1, buf);
                        });
                });
              }
              if(req.files.file2){
                var productImage2 = req.files.file2;
                var path2 = 'public/product-images/' + title + '/gallery/' + req.files.file2.name;
                var thumbsPath2 = 'public/product-images/' + title + '/gallery/thumbs/' + req.files.file2.name;

                productImage2.mv(path2, function (err) {
                        console.log(err);
                        resizeImg(fs.readFileSync(path2), {width: 100, height: 100}).then(function (buf) {
                            fs.writeFileSync(thumbsPath2, buf);
                        });
                });
              }
              if(req.files.file3){
                var productImage3 = req.files.file1;
                var path3 = 'public/product-images/' + title + '/gallery/' + req.files.file3.name;
                var thumbsPath3 = 'public/product-images/' + title + '/gallery/thumbs/' + req.files.file3.name;

                productImage3.mv(path, function (err) {
                        console.log(err);
                        resizeImg(fs.readFileSync(path3), {width: 100, height: 100}).then(function (buf) {
                            fs.writeFileSync(thumbsPath3, buf);
                        });
                });
              }

               res.redirect('/admin/product/');
           });
  router.get('/deleteimage/:image/:id', function (req, res) {

    var originalImage = 'public/product-images/' + req.query.title + '/gallery/' + req.params.image;
    var thumbImage = 'public/product-images/' + req.query.title + '/gallery/thumbs/' + req.params.image;

    fs.unlink(originalImage, function (err) {
        if (err) {
            console.log(err);
        } else {
            fs.unlink(thumbImage, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/admin/product/editproduct/' + req.params.id);
                }
            });
        }
    });
});
router.get('/deleteproduct/:id/:title',function(req,res){
  var id = req.params.id;
  var title = req.params.title;
var path = 'public/product-images/' + title;

fs.rmdir(path,{ recursive: true }, function (err) {
    if (err) {
        console.log(err);
    } else {
        Product.findByIdAndRemove(id, function (err) {
            console.log(err);
        });

        res.redirect('/admin/product');
    }
});
});

module.exports= router;
