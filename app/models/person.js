var mongoose = require('mongoose');
var q = require('q');
var bcrypt = require('bcrypt');
var ObjectId = require('mongoose').Schema.ObjectId;

var PersonSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, require: false, unique: true},
  password: {type: String, required: false},
  creator: {type: ObjectId, ref: 'Person'}
});

PersonSchema.methods.verifyPassword = function(passwordToCheck) {
  var deferred = q.defer();

  var storedPassword = this.password;

  console.log(this.password)

  bcrypt.compare(passwordToCheck, storedPassword, function(err, match){
    if(err) {
      deferred.reject(err);
    }else if(match){
      deferred.resolve();
    }
    else deferred.reject('No match');
  });
  return deferred.promise;
};

var Person = mongoose.model('Person', PersonSchema);

Person.passwordComplexity = function(passwordToCheck){
  return passwordToCheck.length >= 8;
};

Person.hashPassword = function(passwordToHash){
  var deferred = q.defer();
  bcrypt.hash(passwordToHash, 12 /*salt complexity*/, function(err, hash){
    if(err){
      deferred.reject(err);
    }else{
      deferred.resolve(hash);
    }
  });
  return deferred.promise;
};

var format = function(person){
  if(person && person.name){
    return {
      id: person._id,
      name: person.name,
      password: person.password,
      email: person.email
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