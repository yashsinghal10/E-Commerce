var express = require('express');
var router = express.Router();
// Get Page model
var Page = require('../models/page');

router.get('/', function (req, res) {
    Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
        res.render('./admin/admin_page', {
            pages: pages
        });
    });
});
router.get('/addpage',function(req,res){
  var title = "";
  var slug = "";
  var content = "";
  res.render('./admin/admin_addpage',{
    title : title,
    slug: slug,
    content:content
  });
});
router.post('/addpage',function(req,res){
  var title = req.body.title; //name field of the forms
  var slug = req.body.slug;
  var content = req.body.content;
  var page = new Page({
    title: title,
    content: content,
    slug : slug,
    sorting:100
  });
  page.save(function(err){
    if(err){
      return console.log(err);
    }
    else{
      return console.log("success");
    }
  });
  res.redirect('/admin/page');
});
router.get('/editpage/:id',function(req,res){
   Page.findOne({_id:req.params.id},function(err,page){
     if(err){
       return console.log(err);
     }
     res.render('./admin/admin_editpage',{
       title : page.title,
       slug: page.slug,
       content:page.content,
       id:page._id
     });
   });
});
router.post('/editpage/:id',function(req,res){
 Page.findById(req.params.id,function(err,page){
   if(err){
     return console.log(err);
   }
   page.title = req.body.title;
   page.slug = req.body.slug;
   page.content = req.body.content;
  page.save(function(err){
    if(err){
      return console.log(err);
    }
    else{
      return console.log("success");
    }
  });
});
  res.redirect('/admin/page');
});
router.get('/deletepage/:id',function(req,res){
   Page.findByIdAndRemove(req.params.id,function(err,page){
     if(err){
       return console.log(err);
     }
     res.redirect('/admin/page')
   });
});
// export
module.exports = router;
