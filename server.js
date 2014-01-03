
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./app/routes');
var http = require('http');
var path = require('path');
var moment = require('moment');

// Load configurations
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
    config = require('./config/config'),
    mongoose = require('mongoose');

// Bootstrap db connection
var db = mongoose.connect(config.db);

var OutputFormat = {find: function(foo){console.log(foo);}};
var idRegex = '([a-zA-z0-9\-]{3,})';

var ObjectId = mongoose.Types.ObjectId;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.all('*', function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Define database schema
var Game = require('./app/models/game.js');
var Tournament = require('./app/models/tournament.js');
var Team = require('./app/models/team.js')(mongoose);
var Person = require('./app/models/person.js')(mongoose);

var tournamentInit = require('./app/routes/tournament');
var tournament = new tournamentInit(moment, Tournament, ObjectId, OutputFormat);

app.get('/', routes.index);

app.get('/tournaments', tournament.list);
app.post('/tournaments', tournament.create);
app.get('/tournaments/:id'+idRegex, tournament.get);
app.get('/tournaments/:id'+idRegex+'/details', tournament.details);
app.del('/tournaments/:id'+idRegex, tournament.delete);
//app.post('/tournaments/:id([a-fA-F0-9]{24})/update', tournament.patch);
//app.get('/tournament/:id([a-fA-F0-9]{24})/update', tournament.update);
//app.get('/tournaments/new', tournament.new);

var teamInit = require('./app/routes/team');
var team = new teamInit(Team, ObjectId);

app.get('/teams', team.list);
app.post('/teams', team.create);
app.get('/teams/:id'+idRegex, team.get);
app.del('/teams/:id'+idRegex, team.delete);

var gameInit = require('./app/routes/game');
var game = new gameInit(Game, ObjectId, OutputFormat);

var root = '/tournaments/:tournamentid'+idRegex+'/games';
app.get(root, game.list);
app.post(root, game.create);
app.get(root+'/:id'+idRegex, game.get);
app.del(root+'/:id'+idRegex, game.delete);

// app.get('/games', game.list);
// app.get('/game/:id'+idRegex, game.get);
// app.post('/game/:id([a-fA-F0-9]{24})/update', game.patch);
// app.get('/game/:id([a-fA-F0-9]{24})/update', game.update);
// app.get('/games/new', game.new);
// app.post('/games/new', game.create);

var personInit = require('./app/routes/person');
var person = new personInit(Person, ObjectId, OutputFormat);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
