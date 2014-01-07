var Game = require('../models/game');
var Tournament = require('../models/tournament');
var Person = require('../models/person');

var populate = ['headReferee', 'assistantReferees', 'teams.team', {path: 'teams.team', model: 'Team'}];

var methods = {

  list: function(req, res){
    if(req.route.params.tournamentid){
      Tournament.findOne({alias: req.route.params.tournamentid}, function(err, tournament){
        if(!err && tournament){
          Game.find({tournament: tournament._id}).populate(populate).exec(function(err, games){
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
      Game.find().populate(populate).exec(function(err, games){
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
    Game.findOne({_id: id}).populate(populate).exec(function(err, game){
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
    console.log(req.body);

    var newGame = {
      pitch: req.body.pitch,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      gameTime: req.body.gameTime,
    };

    if(req.body.tournament){
      newGame.tournament = req.body.tournament.id || req.body.tournament;
    }
    if(req.body.headReferee){
      newGame.headReferee = req.body.headReferee.id || req.body.headReferee;
    }
    if(req.body.snitch){
      newGame.snitch = req.body.snitch.id || req.body.snitch;
    }
    if(req.body.teams){
      var arr = [];
      for(var i = 0; i < req.body.teams.length; ++i){
        arr[arr.length] = {team: req.body.teams[i]};
      }
      newGame.teams = arr;
    }

console.log(newGame);

    var game = new Game(newGame);

    game.save(function(err){
      if(!err){
        return res.send(201);
      }else {
        return res.send(500, err);
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
  
  // Assistant Referees
  app.post('/games/:id'+app.get('idRegex')+'/assistantReferees', methods.postAssistantRefs);
  
  // Teams
  // app.post('/games/:id'+app.get('idRegex')+'/teams', methods.postTeams);
  // app.post('/games/:id'+app.get('idRegex')+'/teams', methods.postTeams);
}