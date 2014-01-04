process.env.NODE_ENV = 'test';

var expect = require('expect.js');
var app = require('../app/app');
var request = require('supertest')(app);

// Drop database before running tests

if(process.env.NODE_ENV !== 'test'){
  console.log("Not in test mode!");
  process.exit(1);
}

after(function(done){
    app.get('db').connection.db.dropDatabase(done);
});

describe('Tournaments Endpoint', function(){

  describe('/tournaments', function(){
    it('[GET]', function(done){
      request
        .get('/tournaments')
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.be.an('array');
          expect(res.body).to.be.empty();
          done();
        });
    });

    var content = {
      id: 'test',
      director: 'test',
      date: 'test',
      location: 'test',
      name: 'test'
    };

    it('[POST]', function(done){
      request
        .post('/tournaments')
        .send(content)
        .expect(201, done);
    });

    it('[GET]', function(done){
      request
        .get('/tournaments')
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(1);
          expect(res.body[0]).to.eql(content);
          done();
        });
    });



  });
});