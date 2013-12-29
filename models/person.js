module.exports = function(mongoose){
  var PersonSchema = new mongoose.Schema({
    name: {type: String, required: true}
  });

  var Person = mongoose.model('Peson', PersonSchema);


  var format = function(person){
    return person;
  };

  Person.format = function(person){
    if(Array.isArray(person)){
      // Array of persons
      var formatted = [];
      for(var i = 0; i < person.length; ++i){
        formatted[formatted.length] = format(person[i]);
      }
      return formatted;
    }else{
      // Single person
      return format(person);
    }
  };


  return Person;
}