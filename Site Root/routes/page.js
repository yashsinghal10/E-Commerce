var express = require('express');
var router = express.Router();

router.get('/', function(req,res){
   res.render('index',{
     username : 'Yash'
   });
});

router.get('/home', function(req,res){
   res.render('index',{
     username : 'Yash'
   });
});
// export
module.exports = router;
