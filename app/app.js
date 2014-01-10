/**
 * Module dependencies.
 */

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var path = require('path');
var moment = require('moment');
var mongoose = require('mongoose');

var auth = require('./auth'),
    passport = auth.passport;

// Load configuration
var config = require('../config/config');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');
app.set('db', mongoose.connect(config.db));
app.set('aliasRegex', '([a-zA-z0-9\-]{3,})');
app.set('idRegex', '([0-9a-fA-F]{24})');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({secret: config.cookieSecret}));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);

app.all('*', function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
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
auth.routes(app);

module.exports = app;
