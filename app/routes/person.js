var Person = require('../models/person');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;


var methods = {

  list: function(req, res){
    Person.find(function(err, persons){
      if(!err){
        return res.send(Person.format(persons));
      }else{
        return res.send(400, err);
      }
    });
  },

  get: function(req, res){
    var id = req.route.params.id;
    Person.findOne({_id: id}, function(err, person){
      if(!err){
        return res.send(Person.format(person));
      }else{
        return res.send(500, err);
      }
    });
  },

  delete: function(req, res){
    var id = req.route.params.id;
    Person.findOne({_id: id}, function(err, person){
      if(!err && person && person.remove()){
        return res.send(204);
      }else{
        return res.send(404);
      }
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

    Person.findOne({_id: id}, function(err, person){
      if(!err && person){
        person.name = req.body.name;

        person.save(function(err) {
          if(!err){
            return res.send(Person.format(person));
          }else{
            return res.send(400, err);
          }
        });

      }else if(!person){
        return res.send(404);
      }else{
        return res.send(err);
      }
    });
  }

}

module.exports = function(app) {
  app.get('/person/list', methods.list);
  app.post('/person', methods.post);
  app.get('/person/:id'+app.get('idRegex'), methods.get);
  app.put('/person/:id'+app.get('idRegex'), methods.put);
  app.del('/person/:id'+app.get('idRegex'), methods.delete);
}