var container = require('../model/container');

var moment = require('moment');
var express = require('express');
var router = express.Router();

var vyblejChybu = function (res) {
  return function (err) {
    //TODO adjust this for production
    res
      .status(500)
      .write(err)
      .end();
  }
}

var convertDates = function (kontejner) {
  // TODO fix this in the view helper
  kontejner.creation_date = moment(kontejner.creation_date).locale('cs').calendar();
  kontejner.last_edit_date = moment(kontejner.last_edit_date).locale('cs').fromNow();
  return kontejner;
}


// list
router.get('/', function (req, res) {
  container.listAll()
    .then(function (kontejner) {
      res.render('container/list', {
        kontejner: kontejner
      });
    })
    .catch(vyblejChybu(res));
});

// TODO neexistuje nejaky framework na CRUD? to je napicu si takle psat vsechno ruco.

// create - put
router.get('/novy', function (req, res) {
  res.render('container/form');
});

// create - put
router.put('/', function (req, res) {
  var losDatos = req.body;
  container.create(losDatos)
    .then(function (id) {
      res.redirect('/kontejner/' + id);
    })
    .catch(vyblejChybu(res));
});

// read
router.get('/:id', function (req, res) {
  container.read(req.params.id)
    .then(convertDates)
    .then(function (kontejner) {
      res.render('container/show', kontejner);
    })
    .catch(vyblejChybu(res));
});

// update - get
router.get('/:id/upravit', function (req, res) {
  container.read(req.params.id)
    .then(function (kontejner) {
      res.render('container/form', kontejner);
    })
    .catch(vyblejChybu(res));
});

// update - post
router.post('/:id', function (req, res) {
  var id = req.params.id;
  var losDatos = req.body;
  container.update(id, losDatos)
    .then(function (kontejner) {
      res.redirect('/kontejner/' + id);
    })
    .catch(vyblejChybu(res));
});

// delete
router.delete('/:id', function (req, res) {
  container.delete(req.params.id)
    .then(function (kontejner) {
      res.redirect('/kontejner');
    })
    .catch(vyblejChybu(res));
});

module.exports = router;
