var Game = require('../models/game');
var Tournament = require('../models/tournament');
var Person = require('../models/person');
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
      Game.find().populate(['headReferee', 'assistantReferees']).exec(function(err, games){
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
    Game.findOne({_id: id}).populate('headReferee').exec(function(err, game){
      if(!err && game){
        return res.send(Game.format(game));
      }else if(!game){
        return res.send(404);
      }else{
        return res.send(500, err);
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
        return res.send(201);
      }else {
        return res.send(500);
      }
    });
  },

  put: function(req, res){
  },

  postAssistantRefs: function(req, res){
    Person.findOne({_id: req.body.id}, function(err, person){
      if(!err && person){
        console.log(req.route.params.id);
        Game.findOne({_id: req.route.params.id}, function(err, game){
          if(!err && game){
            game.assistantReferees.push(person);

            game.save(function(err){
              if(!err){
                return res.send(200);
              }else{
                return res.send(500, err);
              }
            });
          }else if(!game){
            return res.send(404);
          }else{
            return res.send(500, err);
          }
        });
      }else if(!person){
        return res.send(404);
      }else{
        return res.send(500, err);
      }
    });
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
  app.get('/games/:id'+app.get('idRegex'), methods.get);
  app.put('/games/:id'+app.get('idRegex'), methods.put);
  app.post('/games/:id'+app.get('idRegex')+'/assistantReferees', methods.postAssistantRefs);
}