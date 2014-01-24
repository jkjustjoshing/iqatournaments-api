var Tournament = require('../models/tournament');
var Team = require('../models/team');
var moment = require('moment');
var _ = require('underscore');
var Game = require('../models/game');

var methods = {

  list: function(req, res){
    Tournament.get().then(
      function(tournaments){
        return res.send(Tournament.format(tournaments));
      },
      function(errObj){
        return res.send(errObj.status, errObj.err);
      });
  },

  get: function(req, res){
    var searchObject;
    if(req.route.params.alias){
      searchObject = {alias: req.route.params.alias};
    }else if(req.route.params.id){
      searchObject = {_id: req.route.params.id};
    }

    Tournament.getOne(searchObject).then(
      function(tournament){
        console.log('got tournament '+tournament.toString());
        Game.get({tournament: tournament._id}).then(function(games){
          tournament.games = games;
        }).fin(function(){
          return res.send(Tournament.details(tournament));
        });
      }, 
      function(errObj){
        return res.send(errObj.status, errObj.err);
      });
  },

  delete: function(req, res){
    var alias = req.route.params.alias;
    Tournament.findOne({alias: alias}, function(err, tournament){
      if(!err && tournament && tournament.remove()){
        return res.send(204);
      }else{
        return res.send(404);
      }
    });
  },

  post: function(req, res){
    var tournament = new Tournament({
      alias: req.body.alias,
      name: req.body.name,
      location: req.body.location,
      director: req.body.director,
      date: req.body.date
    });

    tournament.save(function(err){
      if(!err){
        return res.send(201);
      }else {
        return res.send(400, err);
      }
    });
  },

  put: function(req, res){
    var alias = req.route.params.alias;
    Tournament.findOne({alias: alias}, function(err, tournament){
      if(!err && tournament){
        var updates = req.body;
        for(var key in updates){
          tournament[key] = updates[key];
        }

        tournament.save(function(err) {
          if(!err){
            return res.send(Tournament.details(tournament));
          }else{
            return res.send(400, err);
          }
        });

      }else if(!tournament){
        return res.send(404);
      }else{
        return res.send(err);
      }
    });
  },

  teams: {
    post: function(req, res){

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
          Tournament.findOne({_id: req.route.params.id}, function(err, tournament){
            if(!err && tournament){

              if(!tournament.teams){
                tournament.teams = [];
              }

              var unique = (!tournament.teams.length) || _.every(tournament.teams, function(thisTeam){
                if(thisTeam.toString() === team._id.toString()){
                  return false;
                }else{
                  return true;
                }
              });

              if(!unique){
                return res.send(400, {error: 'Duplicate team added'});
              }

              tournament.teams.push(team);

              tournament.save(function(err){
                if(!err){
                  return res.send(200);
                }else{
                  return res.send(500, err);
                }
              });
            }else if(!tournament){
              return res.send(404, {error: 'Tournament not found.'});
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
    }
  }

}


module.exports = function(app){

  app.get('/tournaments', methods.list);
  app.post('/tournaments', methods.post);
  app.get('/tournaments/:id'+app.get('idRegex'), methods.get);
  app.get('/tournaments/:alias'+app.get('aliasRegex'), methods.get);
  app.del('/tournaments/:id'+app.get('idRegex'), methods.delete);
  app.put('/tournaments/:id'+app.get('idRegex'), methods.put);

  // Teams
  app.post('/tournaments/:id'+app.get('idRegex')+'/teams', methods.teams.post);
 // app.post('/tournaments/:alias'+app.get('aliasRegex')+'/teams', methods.teams.delete);


}