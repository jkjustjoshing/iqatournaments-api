var methods = {

  list: function(req, res){
    Game.find(function(err, games){
      if(!err){
        return res.send(games);
      }else{
        return console.log(err);
      }
    });
  },

  get: function(req, res){
    var id = req.route.params.id;
    Game.find({_id: new ObjectId(id)}, function(err, game){
      if(!err){
        return res.send(OutputFormat.success(game));
      }else{
        return res.send(OutputFormat.error(err));
      }
    });
  },

  delete: function(req, res){
    var id = req.route.params.id;
    Game.find({_id: new ObjectId(id)}, function(err, game){
      if(!err){
        return res.send(OutputFormat.success(game));
      }else{
        return res.send(OutputFormat.error(err));
      }
    });
  },

  new: function(req, res){
    console.log('new');
    res.render('games/new', {title: 'New Game'});
  },

  create: function(req, res){
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
  },

  update: function(req, res){
    var id = req.route.params.id;
    Game.find({_id: new ObjectId(id)}, function(err, game){
      if(!err){
        return res.render('games/new', {title: 'Update Game', game: game});
      }else{
        return res.send(OutputFormat.error(err));
      }
    });
  },

  patch: function(req, res){
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

  }

}

module.exports = function(app) {

  
  var root = '/tournaments/:tournamentid'+app.get('idRegex')+'/games';
  app.get(root, methods.list);
  app.post(root, methods.create);
  app.get(root+'/:id'+app.get('idRegex'), methods.get);
  app.del(root+'/:id'+app.get('idRegex'), methods.delete);
  // app.get('/games', game.list);
  // app.get('/game/:id'+idRegex, game.get);
  // app.post('/game/:id([a-fA-F0-9]{24})/update', game.patch);
  // app.get('/game/:id([a-fA-F0-9]{24})/update', game.update);
  // app.get('/games/new', game.new);
  // app.post('/games/new', game.create);
}