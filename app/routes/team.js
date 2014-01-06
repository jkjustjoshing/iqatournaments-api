var Team = require('../models/team');
var Person = require('../models/person');
var ObjectId = require('mongoose').Schema.ObjectId;

var methods = {

  list: function(req, res){
    Team.find().populate('captain').exec(function(err, teams){
      if(!err){
        return res.send(Team.format(teams));
      }else{
        return res.send(500, err);
      }
    });
  },

  get: function(req, res){
    var alias = req.route.params.alias;
    Team.findOne({alias: alias}).populate('captain').exec(function(err, team){
      if(!err && team){
        return res.send(Team.format(team));
      }else if (!team){
        return res.send(404);
      }else{
        return res.send(500, err);
      }
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

    Person.findOne({_id: req.body.captain}, function(err, captain){
      if(!err && captain){
        team.captain = captain;
      }else if (!captain){
        return res.send(404);
      }else{
        return res.send(500, err);
      }

      team.save(function(err){
        if(!err){
          return res.send(201);
        }else {
          return res.send(500, err);
        }
      });
    });
  },


  delete: function(req, res){
    var alias = req.route.params.alias;
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

    Team.findOne({alias: alias}).populate('captain').exec(function(err, team){
      if(!err && team){
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
          Person.findOne({_id: updates.captain}, function(err, captain){
            if(!err && captain){
              team.captain = captain;
              return saveTeam();
            }else if (!captain){
              return res.send(404);
            }else{
              return res.send(500, err);
            }
          });
        }
      }else if(!team){
        return res.send(404);
      }else{
        return res.send(500, err);
      }
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