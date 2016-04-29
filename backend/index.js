var express = require('express');
var mustacheExpress = require('mustache-express');
var _ = require('lodash');

var elasticsearch = require('elasticsearch');
var es = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

app = express();

var viewsDir = __dirname + '/views';

var odpadyOdpadek = function (options) {
  return _.assign({
    index: 'odpady',
    type: 'odpadek'
  }, options);
};

// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());


app.set('view engine', 'mustache');
app.set('views', viewsDir);

//app.use(express.static(__dirname + '/public')); // set static folder

app.get('/', function(req, res) {
  res.render('master', {
    homepage: {
      title: 'page title',
      items: {
        _id: 'idcko12312312',
        title: 'post title'
      } 
    }
  });
});

// get all of them
app.get('/odpadky', function(req, res) {
  es.search(odpadyOdpadek())
  .then(function(resp){
    var odpadky = resp.hits.hits.map(function(hit){ return _.assign(hit._source, {id: hit._id}); });
    console.log("got:" + JSON.stringify(odpadky, null, 2));
    res.render('odpadky', {
      homepage: {
        title: 'page title',
      }, 
      odpadky: odpadky
    });
  });
});

// get single one
app.get('/odpadek/:id', function (req, res) {
  es.get(odpadyOdpadek({id: req.params.id}))
  .then(function(resp){
    res.render('odpadek', resp._source);
  });
});


app.listen(process.env.PORT || 3000);
