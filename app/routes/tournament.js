var Tournament = require('../models/tournament');
var moment = require('moment');

var methods = {

  list: function(req, res){
    Tournament.find(function(err, tournaments){
      if(!err){
        return res.send(Tournament.format(tournaments));
      }else{
        return res.send(err);
      }
    });
  },

  get: function(req, res){
    var alias = req.route.params.alias;
    Tournament.findOne({alias: alias}, function(err, tournament){
      if(!err && tournament){
        return res.send(Tournament.details(tournament));
      }else if(!tournament){
        return res.send(404);
      }else{
        return res.send(err);
      }
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
  }

}


module.exports = function(app){

  app.get('/tournaments', methods.list);
  app.post('/tournaments', methods.post);
  app.get('/tournaments/:alias'+app.get('aliasRegex'), methods.get);
  app.del('/tournaments/:alias'+app.get('aliasRegex'), methods.delete);
  app.put('/tournaments/:alias'+app.get('aliasRegex'), methods.put);

}