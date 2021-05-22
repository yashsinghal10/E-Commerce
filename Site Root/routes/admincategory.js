var express = require('express');
var router = express.Router();

var Category = require('../models/category');

router.get('/', function (req, res) {
    Category.find({}).sort({sorting: 1}).exec(function (err, categories) {
        res.render('./admin/admin_category', {
            categories: categories
        });
    });
});
router.get('/addcategory',function(req,res){
  var title = "";
  res.render('./admin/admin_addcategory',{
    title : title
  });
});
router.post('/addcategory',function(req,res){
  var title = req.body.title; //name field of the forms
  var category = new Category({
    title: title,
    sorting:100
  });
  category.save(function(err){
    if(err){
      return console.log(err);
    }
    else{
      return console.log("success");
    }
  });
  res.redirect('/admin/category');
});
router.get('/editcategory/:id',function(req,res){
   Category.findOne({_id:req.params.id},function(err,category){
     if(err){
       return console.log(err);
     }
     res.render('./admin/admin_editcategory',{
       title : category.title,
       id:category._id
     });
   });
});
router.post('/editcategory/:id',function(req,res){
 Category.findById(req.params.id,function(err,category){
   if(err){
     return console.log(err);
   }
   category.title = req.body.title;
  category.save(function(err){
    if(err){
      return console.log(err);
    }
    else{
      return console.log("success");
    }
  });
});
  res.redirect('/admin/category');
});
router.get('/deletecategory/:id',function(req,res){
   Category.findByIdAndRemove(req.params.id,function(err,category){
     if(err){
       return console.log(err);
     }
     res.redirect('/admin/category')
   });
});

module.exports= router;
