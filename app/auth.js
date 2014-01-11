var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var Person = require('./models/person');

passport.use(new LocalStrategy(
  function(username, password, done) {
    Person.findOne({ _id: username }).exec(function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      //if (!user.verifyPassword(password)) { return done(null, false); }
      console.log(user);
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done){
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  // Find user by email
  console.log(id);
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
  routes: function(app){
    app.post('/login', passport.authenticate('local'), function(req, res){
      return res.send(200);
    });
    app.post('/logout', function(req, res){
      req.logout();
      return res.send(200);
    });
  },

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
      res.send(401);
    }else{
      next();
    }
  }
 
};

module.exports = auth;