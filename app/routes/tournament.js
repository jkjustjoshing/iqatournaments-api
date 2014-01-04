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
    var id = req.route.params.id;
    Tournament.findOne({_id: id}, function(err, tournament){
      if(!err && tournament){
        return res.send(Tournament.format(tournament));
      }else if(!tournament){
        return res.send(404);
      }else{
        return res.send(err);
      }
    });
  },

  delete: function(req, res){
    var id = req.route.params.id;
    Tournament.findOne({_id: id}, function(err, tournament){
      if(!err && tournament && tournament.remove()){
        return res.send(204);
      }else{
        return res.send(404);
      }
    });
  },

  post: function(req, res){
    var tournament = new Tournament({
      _id: req.body.id,
      name: req.body.name,
      location: req.body.location,
      director: req.body.director,
      date: req.body.date
    });

    tournament.save(function(err){
      if(!err){
        return res.send(201);
      }else {
        return res.send(err);
      }
    });
  },

  put: function(req, res){
    var id = req.route.params.id;
    Tournament.findOne({_id: id}, function(err, tournament){
      if(!err){
        var updates = req.body;

        for(var key in updates){
          tournament[key] = updates[key];
        }

        tournament.save(function(err) {
          if(!err){
            return res.send(Tournament.format(tournament));
          }else{
            return res.send(err);
          }
        });

      }else{
        return res.send(err);
      }
    });
  }

}


module.exports = function(app){

  app.get('/tournaments', methods.list);
  app.post('/tournaments', methods.post);
  app.get('/tournaments/:id'+app.get('idRegex'), methods.get);
  app.del('/tournaments/:id'+app.get('idRegex'), methods.delete);
  app.put('/tournaments/:id'+app.get('idRegex'), methods.put);

}