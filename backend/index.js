var express = require('express');
var mustacheExpress = require('mustache-express');
var config = require('config');

app = express();

// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + config.views_dir);

//app.use(express.static(__dirname + '/public')); // set static folder

require('./lib/routes')(app, config);

app.listen(process.env.PORT || 3000);
