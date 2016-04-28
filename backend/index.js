var express = require('express');
var mustacheExpress = require('mustache-express');

var elasticsearch = require('elasticsearch');
var es = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

app = express();

var viewsDir = __dirname + '/views';

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

app.get('/odpadky', function(req, res) {
  es.search({
    index: 'odpady', 
    type: 'odpadek'
  }).then(function(resp){
    var odpadky = resp.hits.hits.map(function(hit){ return hit._source; });
    console.log("got:" + JSON.stringify(odpadky, null, 2));
    res.render('odpadky', {
      homepage: {
        title: 'page title',
      }, 
      odpadky: odpadky
    });
  });
});

app.listen(process.env.PORT || 3000);
