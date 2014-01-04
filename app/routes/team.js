var Team = require('../models/team');
var ObjectId = require('mongoose').Schema.ObjectId;

var methods = {

  list: function(req, res){
    Team.find(function(err, teams){
      if(!err){
        return res.send(Team.format(teams));
      }else{
        return res.send(err);
      }
    });
  },

  get: function(req, res){
    var id = req.route.params.id;
    Team.find({_id: new ObjectId(id)}, function(err, team){
      if(!err){
        return res.send(Team.format(team));
      }else{
        return res.send(err);
      }
    });
  },

  delete: function(req, res){
    var id = req.route.params.id;
    Team.find({_id: new ObjectId(id)}, function(err, team){
      if(!err){
        return res.send(Team.format(team));
      }else{
        return res.send(err);
      }
    });
  },

  post: function(req, res){
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
        return res.send(Team.format(team));
      }else {
        return res.send(err);
      }
    });
  },

  put: function(req, res){
    console.log(req.body);
    var id = req.route.params.id;
    var update = {};
    

    Team.update(
      {_id: new ObjectId(id)},
      update,
      {},
      function(){
        return res.send(Team.format({}));
      }
    );

  }

}

module.exports = function(app) {
  app.get('/teams', methods.list);
  app.post('/teams', methods.post);
  app.get('/teams/:id'+app.get('idRegex'), methods.get);
  app.del('/teams/:id'+app.get('idRegex'), methods.delete);
}