require('dotenv').config();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var hbs = require('hbs');
var busboy = require('express-busboy');

var routesIndex = require('./routes/index');
var routesTrash = require('./routes/trash');
var routesBadge = require('./routes/badge');
var routesCategory = require('./routes/category');
var routesContainer = require('./routes/container');

var app = express();

// view engine setup
// TODO this shall probly go to separate file
hbs.registerHelper("equals", function(a, b, options) {
  if (a === b) {
    return options.fn(this);
  }
  else {
    return options.inverse(this);
  }
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
busboy.extend(app, {
  upload: true,
  allowedPath: /odpadky\/.*\/nahraj-obrazek$/,
  mimeTypeLimit: [
    'image/jpeg',
    'image/png',
  ],
});
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routesIndex);
app.use('/odpadky', routesTrash);
app.use('/znamky', routesBadge);
app.use('/kategorie', routesCategory);
app.use('/kontejner', routesContainer);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
