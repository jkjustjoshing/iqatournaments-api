module.exports = function(mongoose, moment, Game){
  var TournamentSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
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

  Tournament.details = function(){

  };

  return Tournament;
}