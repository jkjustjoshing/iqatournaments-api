
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var moment = require('moment');

// Database Connection
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/tournament_management');

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

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Define database schema
var Schema = mongoose.Schema;
var TournamentSchema = new Schema({
  name: {type: String, required: true, unique: true},
  director: {type: String, required: true},
  location: {type: String, required: true},
  date: {type: Number, required: true, default: moment().unix()}
});
var Tournament = mongoose.model('Tournament', TournamentSchema);
var GameSchema = new Schema({
  teams: [{
    name: {type:String, required: true}, 
    score: {type: Number, required: true}
  }],
  duration: {type: Number, default: 20},
  headRef: {type: String, required: true}
});
var Game = mongoose.model('Game', GameSchema);

var tournamentInit = require('./routes/tournament');
var tournament = new tournamentInit(moment, Tournament);

app.get('/', routes.index);

app.get('/tournaments', tournament.list);
app.get('/tournaments/:id(\\d+)', tournament.get);
app.get('/tournaments/new', tournament.new);
app.post('/tournaments/new', tournament.create);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
