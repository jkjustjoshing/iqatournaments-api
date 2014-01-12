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
    console.log('create');
    var person = new Person({
      name: req.body.name
    });

    person.save(function(err){
      if(!err){
        return res.send(201);
      }else {
        return res.send(400, err);
      }
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

  }

}

module.exports = function(app) {
  app.get('/persons', methods.list);
  app.post('/person', methods.post);
  app.get('/person/:id'+app.get('idRegex'), methods.get);
  app.put('/person/:id'+app.get('idRegex'), methods.put);
  app.del('/person/:id'+app.get('idRegex'), methods.delete);

  // Logged in user
  app.get('/user/me', auth.restrict, methods.me);
  app.post('/user/login', auth.passport.authenticate('local'), methods.me);
  app.post('/user/ogout', function(req, res){
    req.logout();
    return res.send(200);
  });
}