var mongoose = require('mongoose');
var q = require('q');
//var bcrypt = require('bcrypt');

var PersonSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, require: false},
  password: {type: String, required: false}
});

PersonSchema.methods.verifyPassword = function(passwordToCheck) {
  
  // Person.getId()

  // bcrypt.compare(passwordToCheck, )
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

Person.getOne = function(search){
  var deferred = q.defer();

  Person.get(search).then(
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

Person.get = function(search){

  var deferred = q.defer();
  Person.find(search, function(err, result){
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


module.exports = Person;