module.exports = function(moment, Tournament, ObjectId, OutputFormat){

  this.list = function(req, res){
    Tournament.find(function(err, tournaments){
      if(!err){
        return res.send(Tournament.format(tournaments));
      }else{
        return res.send(OutputFormat.error(err));
      }
    });
  };

  this.get = function(req, res){
    var id = req.route.params.id;
    Tournament.findOne({_id: id}, function(err, tournament){
      if(!err){
        return res.send(Tournament.format(tournament));
      }else{
        return res.send(err);
      }
    });
  };

  this.details = function(req, res){
    var id = req.route.params.id;
    Tournament.findOne({_id: id}, function(err, tournament){
      console.log(tournament);if(!err){
        return res.send(Tournament.format(tournament));
      }else{
        return res.send(OutputFormat.error(err));
      }
    });
  };

  this.delete = function(req, res){
    var id = req.route.params.id;
    Tournament.findOne({_id: new ObjectId(id)}, function(err, tournament){
      if(!err && tournament && tournament.remove()){
        return res.send(204);
      }else{
        return res.send(404);
      }
    });
  };

  this.new = function(req, res){
    console.log('new');
    res.render('tournaments/new', {title: 'New Tournament'});
  };

  this.create = function(req, res){
    console.log('create');
    var tournament = new Tournament({
      _id: req.body.id,
      name: req.body.name,
      location: req.body.location,
      director: req.body.director,
      date: moment().format('L')
    });

    console.log(req);

    tournament.save(function(err){
      if(!err){
        return res.send(201);
      }else {
        return res.send(err);
      }
    });
  };

  this.patch = function(req, res){

  };

  this.update = function(req, res){

  };

}