var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var Person = require('./models/person');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    Person.getOne({ email: email }).then(
      function(user){
        console.log('person', user);
        console.log(user.verifyPassword(password));
        user.verifyPassword(password).then(
          function(){
            // Successfully logged in
            console.log('done password matches');
            return done(null, user);
          },
          function(){
            // Passwords don't match
            console.log('done no password');
            return done(null, false); 
          });        
      },
      function(errObj){
        if(errObj.status === 404){
          return done(null, false);
        }else{
          return done(errObj.err);
        }
      });
  }
));

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  // Find user by email
  if(id){
    Person.getOne({_id: id}).then(
      function(person){
        done(null, person)
      },
      function(errObj){
        if(errObj.status === 404){
          // In this case, not finding the person means they aren't logged in
          // MAY NEED TO CALL done()!!
          return res.send(403);
        }else{
          done(errObj.err);
        }
      });
  }else{
    done(null, null);
  }
});


var auth = {
  passport: passport,

  authenticate: function(req, res, next){
    passport.authenticate('local', function(err, user, info){
      if(err){
        return next(err);
      }else if(!user){
        // Not logged in
        console.log('not logged in', info);
        return res.send(200, 'not logged in');
      }else{
        // Logged in
        console.log('logged in', user, info);
        return res.send(200, 'logged in');
      }
    })(req, res, next);

  }, 
  restrict: function(req, res, next){
    if(!req.isAuthenticated()){
      console.log('restricti');
      res.send(401);
    }else{
      next();
    }
  }
 
};

module.exports = auth;