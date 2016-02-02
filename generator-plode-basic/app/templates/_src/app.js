var http = require('http');
var path = require('path');
var express = require('express');
var compression = require('compression');
var ejs = require('ejs');
var morgan = require('morgan'); // htttp req logger
var nconf = require('nconf');
var constants = require('./server/constants');

// Configuration
// (Move to separate file?)
nconf
  .env()
  .argv()
  .defaults(constants);

var isDev = nconf.get('NODE_ENV') === 'dev';

// Parent App
var app = express();

// gzip
app.use(compression());

// Caching
var oneDayCache = { maxAge: 86400000 };

// Logging
app.use(morgan(isDev ? 'dev' : 'combined'));

// Service routes
var routes = require('./server/routes');
app.use('/api', routes);

// need to access node_modules directory
var jasminePath = path.resolve(__dirname + '/..');
var tests = express();
tests.use('/', express.static(jasminePath), oneDayCache);
tests.engine('html', ejs.renderFile);
tests.set('views', jasminePath);
tests.set('view engine', 'html');
tests.get('/', function(req, res) {
  res.render('src/public/tests.html');
});

app.use('/tests', tests);

// For client React Router purposes
var clientDir = __dirname + (isDev ? '/public/' : '/dist/');
var client = express();
client.use('/', express.static(clientDir), oneDayCache);
client.engine('html', ejs.renderFile);
client.set('views', clientDir);
client.set('view engine', 'html');

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
