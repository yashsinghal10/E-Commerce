var express = require('express');
var path = require('path');
var config = require('./config/database');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');// required to extract data from form
var session = require('express-session');
var expressValidator = require('express-validator');
var fileUpload = require('express-fileupload');
var passport = require('passport');
var cors = require('cors');
var crypto = require('crypto');
var Razorpay = require('razorpay');
var flash = require('connect-flash');
//Connect to Database
mongoose.connect(config.database,);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected!'");
});
// Initialising the app
var app = express();

// Views engine setup
app.set('views',path.join(__dirname, 'views'));
app.set('view engine','ejs');

//Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Validator middleware
/*
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
                , root = namespace.shift()
                , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
  /*  customValidators: {
        isImage: function (value, filename) {
            var extension = (path.extname(filename)).toLowerCase();
            switch (extension) {
                case '.jpg':
                    return '.jpg';
                case '.jpeg':
                    return '.jpeg';
                case '.png':
                    return '.png';
                case '':
                    return '.jpg';
                default:
                    return false;
            }
        }
    }
}));*/

// Using body-parser to get value of forms
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(fileUpload({
    // configure middleware to create parent directories
    createParentPath: true
}));
 // as body parser dont handle procurement of files from forms
// set local error null
app.locals.errors = null;

// express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
// Express Messages middleware
app.use(flash());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});
var Page = require('./models/page');

// Get all pages to pass to header.ejs
Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
    if (err) {
        console.log(err);
    } else {
        app.locals.pages = pages;
    }
});

// Get Category Model
var Category = require('./models/category');

// Get all categories to pass to header.ejs
Category.find(function (err, categories) {
    if (err) {
        console.log(err);
    } else {
        app.locals.categories = categories;
    }
});
// Get Category Model
var Cart = require('./models/category');

// Get all categories to pass to header.ejs
Cart.find(function (err, cart) {
    if (err) {
        console.log(err);
    } else {
        app.locals.cart = cart;
    }
});
// passport middleware

// Auth Routes
app.get('/failed', (req, res) => res.send('You Failed to log in!'))
app.get('/google', passport.authenticate('google', { scope: ['email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log(req.user);
    res.redirect('/products/');
  }
);
app.get('*', function(req,res,next) {
   res.locals.user = req.user || null;
   next();
});
// storing user in variale
// Set routes
var page = require('./routes/page');
var user = require('./routes/user');
var products = require('./routes/products');
var adminpage = require('./routes/adminpage');
var admincategory = require('./routes/admincategory');
var adminproduct = require('./routes/adminproduct');
var cartp = require('./routes/cart');
var order = require('./routes/order');
var adminorder = require('./routes/adminorder');

app.use('/',page);
app.use('/user',user);
app.use('/products/',products);
app.use('/admin/page/',adminpage);
app.use('/admin/category/',admincategory);
app.use('/admin/product/',adminproduct);
app.use('/admin/order/',adminorder);
app.use('/cart/',cartp);
app.use('/order/',order);

// Start the server
var port = 3000;
app.listen(port, function () {
    console.log('Server started on port ' + port);
});
