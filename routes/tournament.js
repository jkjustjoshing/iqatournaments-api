module.exports = function(moment, Tournament, ObjectId, OutputFormat){

  this.list = function(req, res){
    Tournament.find(function(err, tournaments){
      if(!err){
        return res.send(OutputFormat.success(tournaments));
      }else{
        return res.send(OutputFormat.error(err));
      }
    });
  };

  this.get = function(req, res){
    var id = req.route.params.id;
    Tournament.find({_id: new ObjectId(id)}, function(err, tournament){
      if(!err){
        return res.send(OutputFormat.success(tournament));
      }else{
        return res.send(OutputFormat.error(err));
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
      name: req.body.name,
      location: req.body.location,
      director: req.body.director,
      date: moment().unix()
    });

    tournament.save(function(err){
      if(!err){
        return res.send(OutputFormat.success({}));
      }else {
        return res.send(OutputFormat.success(err));
      }
    });
  };

  this.patch = function(req, res){

  };

  this.update = function(req, res){

  };

}