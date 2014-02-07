var Game = require('../models/game');
var Tournament = require('../models/tournament');
var Person = require('../models/person');
var _ = require('underscore');
var ObjectId = require('mongoose').Schema.ObjectId;

var methods = {

  list: function(req, res){
    Game.get({tournament: req.route.params.tournamentid}).then(function(games){
      return res.send(Game.format(games));
    });
  },

  get: function(req, res){
    var id = req.route.params.id;
    Game.getOne({_id: id}).then(function(game){
      if(game.tournament.toString() != req.route.params.tournamentid){
        return res.send(404);
      }else{
        return res.send(Game.format(game));
      }
    });
  },

  delete: function(req, res){
    var id = req.route.params.id;
    var tournamentid = req.route.params.tournamentid;

    // Keep as a find so populate() doesn't run
    Game.find({_id: new ObjectId(id)}, function(err, game){
      if(!err){
        if(game.tournament.toString() == tournamentid && game.remove()){
          return res.send(204);
        }else{
          return res.send(404);
        }
      }else{
        return res.send(500, err);
      }
    });
  },

  post: function(req, res){
    var newGame = {
      pitch: req.body.pitch,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      gameTime: req.body.gameTime,
      tournament: req.route.params.tournamentid
    };

    if(req.body.headReferee){
      newGame.headReferee = req.body.headReferee.id || req.body.headReferee;
    }
    if(req.body.snitch){
      newGame.snitch = req.body.snitch.id || req.body.snitch;
    }
    if(req.body.teams){
      newGame.teams = [];
      _(req.body.teams).each(function(team){
        newGame.teams.push({team: team});
      });
    }
    if(req.body.assistantReferees){
      if(_.isArray(req.body.assistantReferees)){
        newGame.assistantReferees = req.body.assistantReferees;
      }else{
        return res.send(500, {error: 'assistantReferees must be array'});
      }
    }

    var game = new Game(newGame);

    game.save(function(err){
      if(!err){

        Tournament.getOne({_id: req.route.params.tournamentid}).then(function(tournament){
          if(!tournament.games){
            tournament.games = [];
          }

          tournament.games.push(game._id);

          tournament.save(function(err){
            if(!err){
              return res.send(200);
            }else{
              return res.send(500, err);
            }
          });

        });


      }else{
        return res.send(500, err);
      }
    });

  },

  put: function(req, res){
    var id = req.route.params.id;
    var tournamentid = req.route.params.tournamentid;
    Game.findOne({_id: id}, function(game){
      if(game.tournament.toString() != tournamentid){
        return res.send(404);
      }

      // Add some validation here to restrict which fields can be updated
      var updates = req.body;
      for(var key in updates){
        game[key] = updates[key];
      }

      game.save(function(err) {
        if(!err){
          return res.send(Game.format(game));
        }else{
          return res.send(400, err);
        }
      });

    });
  },

  assistantRefs: {

    post: function(req, res){
      Person.findOne({_id: req.body.id}, function(err, person){
        if(!err && person){

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
    },
    delete: function(req, res){

      var id = req.route.params.id;
      Game.findOne({_id: id}, function(err, game){
        if(!err && game){

          game.assistantReferees = 
               _.chain(game.assistantReferees).map(function(id){
                return id.toString();
              }).difference(req.body.id).value();

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

    }
  },

  teams: {
    post: function(req, res){

      return res.send(500, 'NOT YET IMPLEMENTED.');

      var searchObj;

      if(req.body.alias){
        searchObj = {alias: req.body.alias};
      }else if(req.body.id){
        searchObj = {_id: req.body.id};
      }else{
        return res.send(400);
      }

      Team.findOne(searchObj, function(err, team){
        if(!err && team){

          Game.findOne({_id: req.route.params.id}, function(err, game){
            if(!err && game){
              // game.assistantReferees.push(person);

              // game.save(function(err){
              //   if(!err){
              //     return res.send(200);
              //   }else{
              //     return res.send(500, err);
              //   }
              // });
            }else if(!game){
              return res.send(404, {error: 'Game not found.'});
            }else{
              return res.send(500, err);
            }
          });
        }else if(!team){
          return res.send(404, {error: 'Team not found.'});
        }else{
          return res.send(500, err);
        }
      });
    },
    delete: function(req, res){
      return res.send(500, 'NOT YET IMPLEMENTED.');
      // var id = req.route.params.id;

      // if(! _.isArray(req.body.id) ){
      //   return res.send(400);
      // }

      // Game.findOne({_id: id}, function(err, game){
      //   if(!err && game){

      //     game.teams = 
      //          _.chain(game.teams).map(function(id){
      //           return id.toString();
      //         }).difference(req.body.id).value();

      //     game.save(function(err){
      //       if(!err){
      //         return res.send(200);
      //       }else{
      //         return res.send(500, err);
      //       }
      //     });

      //   }else if(!game){
      //     return res.send(404);
      //   }else{
      //     return res.send(500, err);
      //   }
      // });

    }
  }

};

module.exports = function(app) {


  var root = '/tournaments/:tournamentid'+app.get('idRegex');
  // app.get(root, methods.list);
  // app.post(root, methods.create);
  // app.get(root+'/:id'+app.get('idRegex'), methods.get);
  // app.del(root+'/:id'+app.get('idRegex'), methods.delete);
  app.get(root+'/games', methods.list);
  app.post(root+'/games', methods.post);
  app.get(root+'/games/:id'+app.get('idRegex'), methods.get);
  app.put(root+'/games/:id'+app.get('idRegex'), methods.put);
  
  // Assistant Referees
  app.post(root+'/games/:id'+app.get('idRegex')+'/assistantReferees', methods.assistantRefs.post);
  app.del(root+'/games/:id'+app.get('idRegex')+'/assistantReferees', methods.assistantRefs.delete);
  
  // Teams
  app.post(root+'/games/:id'+app.get('idRegex')+'/teams', methods.teams.post);
  app.post(root+'/games/:id'+app.get('idRegex')+'/teams', methods.teams.delete);
}