var expect = require('expect.js');
var request = require('supertest');
var app = require('../server.js');

var mockApi = 'http://iqatournaments.apiary.io';
var realApi = 'http://localhost:3000';

var api = realApi;

describe('Tournaments Endpoint', function(){
  describe('/tournaments', function(){
    it('[GET]', function(done){
      request(app)
        .get('/tournaments')
        .expect(200)
        .end(function(err, res) {
          return done(err);
        });
    });

    it('[POST]', function(done){
      request(app)
        .post('/tournaments')
        .expect(200)
        .end(function(err, res) {
          return done(err);
        });
    });

  });
});