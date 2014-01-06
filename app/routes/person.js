var Person = require('../models/person');

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
    Person.findOne({id: id}, function(err, person){
      if(!err){
        return res.send(Person.format(person));
      }else{
        return res.send(404);
      }
    });
  },

  delete: function(req, res){
    var id = req.route.params.id;
    Person.find({_id: new ObjectId(id)}, function(err, person){
      if(!err){
        return res.send(OutputFormat.success(person));
      }else{
        return res.send(OutputFormat.error(err));
      }
    });
  },

  post: function(req, res){
    console.log('create');
    var person = new Person({
      id: req.body.id,
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
    console.log(req.body);
    var id = req.route.params.id;
    var update = {};
    

    Person.update(
      {_id: new ObjectId(id)},
      update,
      {},
      function(){
        return res.send(OutputFormat.success({}));
      }
    );
  }

}

module.exports = function(app) {
  app.get('/person/list', methods.list);
  app.post('/person', methods.post);
  app.get('/person/:id'+app.get('idRegex'), methods.get);
  app.del('/person/:id'+app.get('idRegex'), methods.delete);
}