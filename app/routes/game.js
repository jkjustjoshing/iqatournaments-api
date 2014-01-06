var Game = require('../models/game');
var Tournament = require('../models/tournament');
var methods = {

  list: function(req, res){
    if(req.route.params.tournamentid){
      Tournament.findOne({alias: req.route.params.tournamentid}, function(err, tournament){
        if(!err && tournament){
          Game.find({tournament: tournament._id}, function(err, games){
            if(!err){
              return res.send(Game.format(games));
            }else{
              return res.send(500, err);
            }
          });
        }else if(!tournament){
          return res.send(404);
        }else{
          return res.send(500, err);
        }
      });
    }else{
      Game.find(function(err, games){
        if(!err){
          return res.send(Game.format(games));
        }else{
          return res.send(500, err);
        }
      });
    }

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

  post: function(req, res){
    var game = new Game({
      tournament: req.body.tournament,
      pitch: req.body.pitch,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      gameTime: req.body.gameTime,
      headReferee: req.body.headReferee,
      snitch: req.body.snitch,
      teams: req.body.teams
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
  }

};

module.exports = function(app) {


  // var root = '/tournaments/:tournamentid'+app.get('aliasRegex')+'/games';
  // app.get(root, methods.list);
  // app.post(root, methods.create);
  // app.get(root+'/:id'+app.get('idRegex'), methods.get);
  // app.del(root+'/:id'+app.get('idRegex'), methods.delete);
  app.get('/games', methods.list);
  app.post('/games', methods.post);
  app.get('/game/:id'+app.get('idRegex'), methods.get);
  app.put('/game/:id'+app.get('idRegex')+'/update', methods.put);
}