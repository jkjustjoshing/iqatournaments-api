var mongoose = require('mongoose'),
    moment = require('moment');

var TournamentSchema = new mongoose.Schema({
  _id: {type: String, required: true, unique: true, match: /^[A-Za-z0-9\-]{3,}$/},
  name: {type: String, required: true, unique: false},
  director: {type: String, required: true},
  location: {type: String, required: true},
  date: {type: String, required: true, default: moment().format('L')}
});

var Tournament = mongoose.model('Tournament', TournamentSchema);

var format = function(tournament){
  return {
    id: tournament._id || "",
    name: tournament.name || "",
    date: tournament.date || "",
    director: tournament.director || "",
    location: tournament.location || ""
  };
};

var formatDetails = function(tournament){
  return {
    id: tournament._id || "",
    name: tournament.name || "",
    date: tournament.date || "",
    director: tournament.director || "",
    location: tournament.location || "",
    teams: tournament.teams || [],
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
  if(Array.isArray(tournament)){
    // Array of tournaments
    var formatted = [];
    for(var i = 0; i < tournament.length; ++i){
      formatted[formatted.length] = formatDetails(tournament[i]);
    }
    return formatted;
  }else{
    // Single tournament
    return formatdetails(tournament);
  }
}

Tournament.details = function(){

};

module.exports = Tournament;