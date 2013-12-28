module.exports = function(mongoose){
  var GameSchema = new mongoose.Schema({
    tournament: {type: ObjectId, required: true},
    pitch: {type: String, required: false},
    startTime: {type: String, required: false}, // regex 2014-04-09T11:20+05:00
    endTime: {type: String, required: false}, // regex 2014-04-09T11:20+05:00
    gameTime: {type: String, default: "20:00"}, // regex "dd:dd"
    headReferee: {type: String, required: true}
    snitch: {type: String, required: true}
    teams: [{
      name: {type:String, required: true}, 
      score: {type: Number, required: false},
      snatch: {type: Boolean, required: false}
    }],
    assistantReferees: [
      {type: String, required: false}
    ]
  });

  var Game = mongoose.model('Game', GameSchema);


  var format = function(game){
    return game;
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


  return Game;
}