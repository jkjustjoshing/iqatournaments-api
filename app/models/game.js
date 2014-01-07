var mongoose = require('mongoose');
var Person = require('./person');
var ObjectId = mongoose.Schema.ObjectId;

var GameSchema = new mongoose.Schema({
  tournament: {type: ObjectId, required: true, ref: 'Tournament'},
  pitch: {type: String, required: false},
  startTime: {type: String, required: false}, // regex 2014-04-09T11:20+05:00
  endTime: {type: String, required: false}, // regex 2014-04-09T11:20+05:00
  gameTime: {type: String, match: /^[0-9]{2}:[0-9]{2}:[0-9]{2}$/}, // regex "dd:dd"
  headReferee: {type: ObjectId, ref: 'Person'},
  snitch: {type: ObjectId, ref: 'Person'},
  teams: [{
    team: {type: ObjectId, required: true, ref: 'Team'},
    score: {type: Number, required: false},
    snatch: {type: Boolean, required: false}
  }],
  assistantReferees: [
    {type: ObjectId, required: false, ref: 'Person'}
  ]
});

var Game = mongoose.model('Game', GameSchema);


var format = function(game){
  return {
    tournament: game.tournament,
    pitch: game.pitch,
    id: game._id,
    assistantReferees: Person.format(game.assistantReferees),
    teams: game.teams,
    headReferee: Person.format(game.headReferee)
  };
};

Game.format = function(game){
  if(Array.isArray(game)){
    // Array of games
    var formatted = [];
    for(var i = 0; i < game.length; ++i){
      formatted[formatted.length] = format(game[i]);
    }
    return formatted;
  }else{
    // Single game
    return format(game);
  }
};



module.exports = Game