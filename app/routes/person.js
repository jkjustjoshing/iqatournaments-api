var Person = require('../models/person');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var auth = require('../auth');


var methods = {

  list: function(req, res){
    Person.get().then(
      function(persons){
        return res.send(Person.format(persons));
      },
      function(errObj){
        return res.send(errObj.status, errObj.err);
      });
  },

  get: function(req, res){
    var id = req.route.params.id;
    Person.getOne({_id: id}).then(
      function(person){
        return res.send(Person.format(person));
      },
      function(errObj){
        return res.send(errObj.status, errObj.err);
      }
      );
  },

  me: function(req, res){
    if(!req.user){
      return res.send(403);
    }else{
      return res.send(Person.format(req.user));
    }
  },

  delete: function(req, res){
    var id = req.route.params.id;
    Person.getOne({_id: id}).then(
      function(person){
        if(person.remove()){
          return res.send(204);
        }else{
          return res.send(500);
        }
      },
      function(errObj){
        return res.send(errObj.status, errObj.err);
      });
  },

  post: function(req, res){
    // Create person
    // If there is a logged in user, mark as creator and don't
    // save password
    // If no logged in user, require password

    if(!Person.passwordComplexity(req.body.password)){
      return res.send(400, {error: 'Password too short.'});
    }

    Person.hashPassword(req.body.password).then(function(hash){

      var person = new Person({
        name: req.body.name,
        email: req.body.email,
        password: hash
      });

      person.save(function(err){
        if(!err){
          return res.send(201);
        }else {
          return res.send(400, err);
        }
      });
    });
  },

  put: function(req, res){
    var id = req.route.params.id;

    Person.getOne({_id: id}).then(
      function(person){
        //person.name = req.body.name;
        for(var key in req.body){
          person[key] = req.body[key];
        }

        person.save(function(err) {
          if(!err){
            return res.send(Person.format(person));
          }else{
            return res.send(400, err);
          }
        });
      },
      function(errObj){
        return res.send(errObj.status, errObj.err);
      }
      );

  },
  search: function(req, res){

    var searchRegex = new RegExp(req.query.name, 'i');

    Person.get({name: searchRegex}).then(
      function(persons){
        return res.send(Person.format(persons));
      },
      function(errObj){
        return res.send(errObj.status, errObj.err);
      });
  }

}

module.exports = function(app) {
  app.get('/persons', methods.list);
  app.post('/persons', methods.post);
  app.get('/persons/:id'+app.get('idRegex'), methods.get);
  app.put('/persons/:id'+app.get('idRegex'), methods.put);
  app.del('/persons/:id'+app.get('idRegex'), methods.delete);

  app.get('/person/search', methods.search);

  // Logged in user
  app.get('/user/me', auth.restrict, methods.me);
  app.post('/user/login', auth.passport.authenticate('local'), methods.me);
  app.post('/user/logout', function(req, res){
    req.logout();
    return res.send(200);
  });
}