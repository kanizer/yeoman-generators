var http = require('http');
var express = require('express');
var compression = require('compression');
var ejs = require('ejs');
var morgan = require('morgan');
var nconf = require('nconf');
var constants = require('./server/constants');

// Configuration
// (Move to separate file?)
nconf
  .env()
  .argv()
  .defaults(constants);

// Parent App
var app = express();

// gzip
app.use(compression());

// Caching
var oneDayCache = { maxAge: 86400000 };

// Logging
app.use(morgan('combined'));

// Service routes
var routes = require('./server/routes');
app.use('/api', routes);

// For client React Router purposes
var clientDir = __dirname + (nconf.get('NODE_ENV') === 'dev' ? '/public/' : '/dist/');
var client = express();
client.use('/', express.static(clientDir), oneDayCache);
client.engine('html', ejs.renderFile);
client.set('views', clientDir);
client.set('view engine', 'html');

client.get('/tests', function(req, res) {
  res.render('tests.html');
});

client.get('*', function(req, res) {
  res.render('index.html');
});

app.use('/', client);

// Fire it up!
// NOTE: Using the http module because this is what
// express does internally anyway
var port = 8080;
http.createServer(app).listen(port, function () {
  console.log('HTTP Express server listening on port %s', port);
});
