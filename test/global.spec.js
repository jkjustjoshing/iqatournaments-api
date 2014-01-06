
//////// Test setup code to run once ////////
process.env.NODE_ENV = 'test';
var app = require('../app/app');
after(function(done){
  app.get('db').connection.db.dropDatabase();
  done();
});