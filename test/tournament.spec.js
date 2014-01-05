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
  app.get('db').connection.db.dropDatabase();
  done();
});

describe('With tournaments, ', function(){

  describe('/tournaments [POST]', function(){
    it('should not allow empty request', function(done){
      request
        .post('/tournaments')
        .expect(400)
        .end(function(err, res){
          if(err){
            done(err);
          }else{
            expect(res.body).to.be.an('object');
            expect(res.body).to.not.be.an('array');
            expect(res.body.errors).to.not.be(undefined);
            done();
          }
        });
    });

    var content = {
      id: 'test-again',
      director: 'test',
      date: '2013-01-01',
      location: 'test',
      name: 'test'
    };


    it('should successfully post', function(done){
      request
        .post('/tournaments')
        .send(content)
        .expect(201, done);
    });

    it('should not allow duplicate id', function(done){
      request
        .post('/tournaments')
        .send(content)
        .expect(400)
        .end(function(err, res){
          if(err){
            done(err);
          }else{
            done();
          }
        });
    });

    it('should not allow malformed date', function(done){
      content.id = 'unique-id';
      content.date = 'invalid date';
      request
        .post('/tournaments')
        .send(content)
        .expect(400)
        .end(function(err, res){
          if(err){
            done(err);
          }else{
            done();
          }
        });
    });
  });

  describe('/tournaments [GET]', function(){

    it('should get a list of tournaments', function(done){
      request
        .get('/tournaments')
        .expect(200)
        .end(function(err, res) {
          if(err){
            done(err);
          }else{
            expect(res.body).to.be.an('array');
            expect(res.body).to.not.be.empty();

            var item = res.body[0];
            expect(item).to.have.property('id');
            expect(item).to.have.property('director');
            expect(item).to.have.property('date');
            expect(item).to.have.property('name');
            expect(item).to.have.property('location');

            done();
          }
        });
    });

  });
});

describe('With single tournament', function(){

  var tournament = {
    id: 'test-tournament',
    location: 'foo',
    director: 'direct',
    date: '2014-03-02',
    name: 'Test Tournament'
  };

  before(function(done){
    request
      .post('/tournaments')
      .send(tournament)
      .end(function(err, res){
        done();
      });
  });
  describe('/tournaments/:id [GET]', function(){

    it('should not find a nonexistant post', function(done){
      request
        .post('/tournaments/nonexistant-post')
        .expect(404, done);
    });

    it('should get back the tournament', function(done){
      request
        .get('/tournaments/'+tournament.id)
        .expect(200)
        .end(function(err, res){
          if(err){
            done(err);
          }else{
            var response = res.body;
            expect(response.teams).to.eql([]);
            expect(response.games).to.eql([]);
            delete response.teams;
            delete response.games;
            expect(response).to.eql(tournament);
            done();
          }
        });
    })

  });

  describe('/tournaments/:id [DELETE]', function(){

    it('should delete the tournament', function(done){
      request
        .del('/tournaments/'+tournament.id)
        .expect(204, done);
    });

    it('should have not found the pre-deleted tournament', function(done){
      request
        .del('/tournaments/'+tournament.id)
        .expect(404, done);
    });

  });

});