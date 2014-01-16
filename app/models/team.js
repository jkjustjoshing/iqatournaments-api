var mongoose = require('mongoose');
var Person = require('./person');
var q = require('q');

var TeamSchema = new mongoose.Schema({
  alias: {type: String, required: true, unique: true, match: /^[A-Za-z0-9\-]{3,23}$/},
  name: {type: String, required: true, unique: false},
  captain: {type: mongoose.Schema.ObjectId, ref: 'Person'},
  members: [{type: mongoose.Schema.ObjectId, ref: 'Person'}]
});

var Team = mongoose.model('Team', TeamSchema);

var populate = 'captain, members';

var format = function(team){
  return {
    id: team._id,
    name: team.name,
    alias: team.alias,
    captain: Person.format(team.captain),
    members: Person.format(team.members)
  };
};

Team.format = function(team){
  if(Array.isArray(team)){
    // Array of games
    var formatted = [];
    for(var i = 0; i < team.length; ++i){
      formatted[formatted.length] = format(team[i]);
    }
    return formatted;
  }else{
    // Single team
    return format(team);
  }
};

Team.getOne = function(search){
  var deferred = q.defer();

  Team.get(search).then(
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

Team.get = function(search){

  var deferred = q.defer();
  Team.find(search).populate(populate).exec(function(err, result){
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


module.exports = Team;