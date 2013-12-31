
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var moment = require('moment');
var OutputFormat = require('./utils/OutputFormat')

// Database Connection
var mongo = require('mongodb');
var mongoose = require('mongoose');
var idRegex = '([a-fA-F0-9]{24})';
mongoose.connect('mongodb://localhost:27017/tournament_management');

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
  
  // Test runner
  app.use('/public/test', express.static(__dirname+'/public/test'));

}

// Define database schema
var Game = require('./models/game.js')(mongoose);
var Tournament = require('./models/tournament.js')(mongoose, moment, Game);
var Team = require('./models/team.js')(mongoose);
var Person = require('./models/person.js')(mongoose);

var tournamentInit = require('./routes/tournament');
var tournament = new tournamentInit(moment, Tournament, ObjectId, OutputFormat);

app.get('/', routes.index);

app.get('/tournaments', tournament.list);
app.post('/tournaments', tournament.create);
app.get('/tournaments/:id'+idRegex, tournament.get);
app.del('/tournaments/:id'+idRegex, tournament.delete);
//app.post('/tournaments/:id([a-fA-F0-9]{24})/update', tournament.patch);
//app.get('/tournament/:id([a-fA-F0-9]{24})/update', tournament.update);
//app.get('/tournaments/new', tournament.new);

var teamInit = require('./routes/team');
var team = new teamInit(Team, ObjectId);

app.get('/teams', team.list);
app.post('/teams', team.create);
app.get('/teams/:id'+idRegex, team.get);
app.del('/teams/:id'+idRegex, team.delete);

var gameInit = require('./routes/game');
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

var personInit = require('./routes/person');
var person = new personInit(Person, ObjectId, OutputFormat);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
