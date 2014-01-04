var Person = require('../models/person');

var methods = {

  list: function(req, res){
    Person.find(function(err, persons){
      if(!err){
        return res.send(persons);
      }else{
        return console.log(err);
      }
    });
  },

  get: function(req, res){
    var id = req.route.params.id;
    Person.find({_id: new ObjectId(id)}, function(err, person){
      if(!err){
        return res.send(OutputFormat.success(person));
      }else{
        return res.send(OutputFormat.error(err));
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
      
    });

    game.save(function(err){
      if(!err){
        return res.send(OutputFormat.success({}));
      }else {
        return res.send(OutputFormat.error(err));
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
  
}