/**
 * Module dependencies.
 */

var express = require('express');
var path = require('path');
var moment = require('moment');

// Load configurations
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
    config = require('../config/config'),
    mongoose = require('mongoose');

// Bootstrap db connection
console.log(config.db);
var db = mongoose.connect(config.db);

var idRegex = '([a-zA-z0-9\-]{3,})';

var ObjectId = mongoose.Types.ObjectId;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('db', db);
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

require('./routes/tournament')(app);
require('./routes/person')(app);
require('./routes/team')(app);
require('./routes/game')(app);

module.exports = app;
