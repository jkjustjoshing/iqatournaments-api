var mongoose = require('mongoose');

var PersonSchema = new mongoose.Schema({
  name: {type: String, required: true}
});

PersonSchema.methods.verifyPassword = function(passwordToCheck) {
  return true;
};

var Person = mongoose.model('Person', PersonSchema);


var format = function(person){
  console.log('person', person);
  if(person && person.name){
    return {
      id: person._id,
      name: person.name
    };
  }else{
    return undefined;
  }
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


module.exports = Person;