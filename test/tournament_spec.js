var frisby = require('frisby');

frisby.create('Get tournaments')
  .get('http://tournamentmanagerapi.apiary.io/tournaments/900000000000000000000000')
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'json')

.toss();