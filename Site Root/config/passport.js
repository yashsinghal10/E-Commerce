var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bcrypt = require('bcryptjs');
var alert= require('alert');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
module.exports = function (passport) {
  passport.use(new GoogleStrategy({
  clientID:'917984350881-5p35p43i9ejbcsj3u65as8o6qofp2qio.apps.googleusercontent.com',
  clientSecret:'yAuaLDK_cVIRqXW9qeuFpbIZ',
  callbackURL:'http://localhost:3000/',
  passReqToCallback:true
},
function(request, accessToken, refreshToken, user, done) {
  console.log(user)
  return done(null, user);
}
));

    passport.use(new LocalStrategy(function (email, password, done) {

        User.findOne({email: email}, function (err, user) {
            if (err)
                console.log(err);
                alert(err);

            if (!user) {
                return done(null, false);
                alert('No user found!');
                  console.log(message);
            }

           bcrypt.compare(password, user.password, function (err, isMatch) {
               if (err)
                    console.log(err);

                if (isMatch) {
                    return done(null, user);
                      console.log("ohk");
                }
                else {
                    return done(null, false);
                    console.log(message);
                    alert('Incorrect Password');
                }
        });
      });
    }));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}
