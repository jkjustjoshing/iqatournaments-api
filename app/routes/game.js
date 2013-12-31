module.exports = function(Game, ObjectId, OutputFormat){

  this.list = function(req, res){
    Game.find(function(err, games){
      if(!err){
        return res.send(games);
      }else{
        return console.log(err);
      }
    });
  };

  this.get = function(req, res){
    var id = req.route.params.id;
    Game.find({_id: new ObjectId(id)}, function(err, game){
      if(!err){
        return res.send(OutputFormat.success(game));
      }else{
        return res.send(OutputFormat.error(err));
      }
    });
  };

  this.delete = function(req, res){
    var id = req.route.params.id;
    Game.find({_id: new ObjectId(id)}, function(err, game){
      if(!err){
        return res.send(OutputFormat.success(game));
      }else{
        return res.send(OutputFormat.error(err));
      }
    });
  };

  this.new = function(req, res){
    console.log('new');
    res.render('games/new', {title: 'New Game'});
  };

  this.create = function(req, res){
    console.log('create');
    var game = new Game({
      teams: [
        {name: req.body.teams[0].name, score: parseInt(req.body.teams[0].score)},
        {name: req.body.teams[1].name, score: parseInt(req.body.teams[1].score)}
      ],
      duration: parseInt(req.body.duration),
      headRef: req.body.headRef
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
    Game.find({_id: new ObjectId(id)}, function(err, game){
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
    

    Game.update(
      {_id: new ObjectId(id)},
      update,
      {},
      function(){
        return res.send(OutputFormat.success({}));
      }
    );

  };

}