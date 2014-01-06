var mongoose = require('mongoose');
var Person = require('./person');

var TeamSchema = new mongoose.Schema({
  alias: {type: String, required: true, unique: true, match: /^[A-Za-z0-9\-]{3,}$/},
  name: {type: String, required: true, unique: false},
  captain: {type: mongoose.Schema.ObjectId, ref: 'Person'}
});

var Team = mongoose.model('Team', TeamSchema);


var format = function(team){
  return {
    name: team.name,
    alias: team.alias,
    captain: Person.format(team.captain)
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


module.exports = Team;