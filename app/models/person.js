var mongoose = require('mongoose');
var q = require('q');

var PersonSchema = new mongoose.Schema({
  name: {type: String, required: true}
});

PersonSchema.methods.verifyPassword = function(passwordToCheck) {
  return true;
};

var Person = mongoose.model('Person', PersonSchema);


var format = function(person){
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

Person.getId = function(id){

  var deferred = q.defer();

  Person.findOne({_id: id}, function(err, person){
    console.log('personn', person);
    if(!err && person){
      console.log(person);
      deferred.resolve(person);
    }else if(!person){
      deferred.reject({status: 404});
    }else{
      return deferred.reject({status: 500, err: err});
    }
  });

  return deferred.promise;
}


module.exports = Person;