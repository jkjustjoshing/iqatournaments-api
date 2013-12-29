module.exports = function(Team, ObjectId, OutputFormat){

  this.list = function(req, res){
    Team.find(function(err, teams){
      if(!err){
        return res.send(teams);
      }else{
        return console.log(err);
      }
    });
  };

  this.get = function(req, res){
    var id = req.route.params.id;
    Team.find({_id: new ObjectId(id)}, function(err, team){
      if(!err){
        return res.send(OutputFormat.success(team));
      }else{
        return res.send(OutputFormat.error(err));
      }
    });
  };

  this.delete = function(req, res){
    var id = req.route.params.id;
    Team.find({_id: new ObjectId(id)}, function(err, team){
      if(!err){
        return res.send(OutputFormat.success(team));
      }else{
        return res.send(OutputFormat.error(err));
      }
    });
  };

  this.new = function(req, res){
    console.log('new');
    res.render('teams/new', {title: 'New Team'});
  };

  this.create = function(req, res){
    console.log('create');
    var team = new Team({
      teams: [
        {name: req.body.teams[0].name, score: parseInt(req.body.teams[0].score)},
        {name: req.body.teams[1].name, score: parseInt(req.body.teams[1].score)}
      ],
      duration: parseInt(req.body.duration),
      headRef: req.body.headRef
    });

    team.save(function(err){
      if(!err){
        return res.send(OutputFormat.success({}));
      }else {
        return res.send(OutputFormat.error(err));
      }
    });
  };

  this.update = function(req, res){
    var id = req.route.params.id;
    Team.find({_id: new ObjectId(id)}, function(err, team){
      if(!err){
        return res.render('games/new', {title: 'Update Game', game: game});
      }else{
        return res.send(OutputFormat.error(err));
      }
    });
  }

  this.patch = function(req, res){
    console.log(req.body);
    var id = req.route.params.id;
    var update = {};
    

    Team.update(
      {_id: new ObjectId(id)},
      update,
      {},
      function(){
        return res.send(OutputFormat.success({}));
      }
    );

  };

}