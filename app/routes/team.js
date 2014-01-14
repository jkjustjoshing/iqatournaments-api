var Team = require('../models/team');
var Person = require('../models/person');
var ObjectId = require('mongoose').Schema.ObjectId;

var methods = {

  list: function(req, res){
    Team.get().then(
      function(teams){
        return res.send(Team.format(teams));
      },
      function(errObj){
        return res.send(errObj.status, errObj.err);
      });
  },

  get: function(req, res){
    var alias = req.route.params.alias;
    Team.getOne({alias: alias}).then(
      function(team){
        return res.send(Team.format(team));
      },
      function(errObj){
        return res.send(errObj.status, errObj.err);
      });
  },

  post: function(req, res){
    var team = new Team({
      name: req.body.name,
      alias: req.body.alias
    });

    if(!req.body.captain){
      return res.send(404);
    }

    Person.getOne({_id: req.body.captain}).then(
      function(captain){
        team.captain = captain;
        team.save(function(err){
          if(!err){
            return res.send(201);
          }else {
            return res.send(500, err);
          }
        });
      },
      function(errObj){
        return res.send(errObj.status, errObj.err);
      });
  },


  delete: function(req, res){
    var alias = req.route.params.alias;

    // Keep as find so that populate() doesn't run
    Team.findOne({alias: alias}, function(err, team){
      if(!err && team && team.remove()){
        return res.send(204);
      }else{
        return res.send(404);
      }
    });
  },

  put: function(req, res){
    var alias = req.route.params.alias;

    Team.getOne({alias: alias}).then(
      function(team){
        var saveTeam = function(){
          team.save(function(err) {
            if(!err){
              return res.send(Team.format(team));
            }else{
              return res.send(400, err);
            }
          });
        }

        var updates = req.body;

        for(var key in updates){
          if(key !== 'captain'){
            team[key] = updates[key];            
          }
        }

        if(!updates.captain){
          return saveTeam();
        }else{
          Person.getOne({_id: updates.captain}).then(
            function(captain){
              team.captain = captain;
              return saveTeam();
            },
            function(errObj){
              return res.send(errObj.status, errObj.err);
            });
        }
      },
      function(errObj){
        return res.send(errObj.status, errObj.err);
      });
  }

};

module.exports = function(app) {
  app.get('/teams', methods.list);
  app.post('/teams', methods.post);
  app.get('/teams/:alias'+app.get('aliasRegex'), methods.get);
  app.put('/teams/:alias'+app.get('aliasRegex'), methods.put);
  app.del('/teams/:alias'+app.get('aliasRegex'), methods.delete);
};