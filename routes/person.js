module.exports = function(Person, ObjectId, OutputFormat){

  this.list = function(req, res){
    Person.find(function(err, persons){
      if(!err){
        return res.send(persons);
      }else{
        return console.log(err);
      }
    });
  };

  this.get = function(req, res){
    var id = req.route.params.id;
    Person.find({_id: new ObjectId(id)}, function(err, person){
      if(!err){
        return res.send(OutputFormat.success(person));
      }else{
        return res.send(OutputFormat.error(err));
      }
    });
  };

  this.delete = function(req, res){
    var id = req.route.params.id;
    Person.find({_id: new ObjectId(id)}, function(err, person){
      if(!err){
        return res.send(OutputFormat.success(person));
      }else{
        return res.send(OutputFormat.error(err));
      }
    });
  };

  this.new = function(req, res){
    console.log('new');
    res.render('persons/new', {title: 'New Person'});
  };

  this.create = function(req, res){
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
  };

  this.update = function(req, res){
    var id = req.route.params.id;
    Person.find({_id: new ObjectId(id)}, function(err, person){
      if(!err){
        return res.render('persons/new', {title: 'Update Person', game: game});
      }else{
        return res.send(OutputFormat.error(err));
      }
    });
  }

  this.patch = function(req, res){
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

  };

}