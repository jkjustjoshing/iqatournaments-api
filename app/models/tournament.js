var mongoose = require('mongoose');
var moment = require('moment');
var q = require('q');
var Person = require('./person');
var Team = require('./team');

var TournamentSchema = new mongoose.Schema({
  alias: {type: String, required: true, unique: true, match: /^[A-Za-z0-9\-]{3,23}$/},
  name: {type: String, required: true, unique: false},
  director: {type: mongoose.Schema.ObjectId, ref: 'Person'},
  location: {type: String, required: true},
  date: {type: String, required: true, default: moment().format('YYYY-DD-MM'), match: /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/},
  teams: [{type: mongoose.Schema.ObjectId, ref: 'Team'}]
});

var Tournament = mongoose.model('Tournament', TournamentSchema);

var format = function(tournament){
  return {
    id: tournament._id || "",
    alias: tournament.alias || "",
    name: tournament.name || "",
    date: tournament.date || "",
    director: Person.format(tournament.director),
    location: tournament.location || ""
  };
};

var formatDetails = function(tournament){
  return {
    id: tournament._id || "",
    alias: tournament.alias || "",
    name: tournament.name || "",
    date: tournament.date || "",
    director: Person.format(tournament.director),
    location: tournament.location || "",
    teams: Team.format(tournament.teams || []),
    games: tournament.games || []
  };
};

Tournament.format = function(tournament){
  if(Array.isArray(tournament)){
    // Array of tournaments
    var formatted = [];
    for(var i = 0; i < tournament.length; ++i){
      formatted[formatted.length] = format(tournament[i]);
    }
    return formatted;
  }else{
    // Single tournament
    return format(tournament);
  }
};

Tournament.details = function(tournament){
  return formatDetails(tournament);
}

Tournament.getOne = function(search){
  var deferred = q.defer();

  Tournament.get(search).then(
    function(result){
      if(result.length === 0){
        deferred.reject({status: 404});
      }else{
        deferred.resolve(result[0]);
      }
    },
    function(errObj){
      deferred.reject(errObj);
    }
    );

  return deferred.promise;
}

Tournament.get = function(search){

  var deferred = q.defer();
  Tournament.find(search).populate('director, teams').exec(function(err, result){
    if(!err && result){
      deferred.resolve(result);
    }else if(!result){
      deferred.reject({status: 404});
    }else{
      deferred.reject({status: 500, err: err});
    }
  });

  return deferred.promise;
}

module.exports = Tournament;