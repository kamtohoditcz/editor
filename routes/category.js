var category = require('../model/category');
var category = require('../model/category');

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

var convertDates = function (kategorie) {
  // TODO fix this in the view helper
  kategorie.creation_date = moment(kategorie.creation_date).locale('cs').calendar();
  kategorie.last_edit_date = moment(kategorie.last_edit_date).locale('cs').fromNow();
  return kategorie;
}


// list
router.get('/', function (req, res) {
  category.listAll()
    .then(function (kategorie) {
      res.render('category/list', {
        kategorie: kategorie
      });
    })
    .catch(vyblejChybu(res));
});

// TODO neexistuje nejaky framework na CRUD? to je napicu si takle psat vsechno ruco.

// create - put
router.get('/nova', function (req, res) {
  res.render('category/form');
});

// create - put
router.put('/', function (req, res) {
  var losDatos = req.body;
  category.create(losDatos)
    .then(function (id) {
      res.redirect('/kategorie/' + id);
    })
    .catch(vyblejChybu(res));
});

// read
router.get('/:id', function (req, res) {
  category.read(req.params.id)
    .then(convertDates)
    .then(function (kategorie) {
      res.render('category/show', kategorie);
    })
    .catch(vyblejChybu(res));
});

// update - get
router.get('/:id/upravit', function (req, res) {
  category.read(req.params.id)
    .then(function (kategorie) {
      res.render('category/form', kategorie);
    })
    .catch(vyblejChybu(res));
});

// update - post
router.post('/:id', function (req, res) {
  var id = req.params.id;
  var losDatos = req.body;
  category.update(id, losDatos)
    .then(function (kategorie) {
      res.redirect('/kategorie/' + id);
    })
    .catch(vyblejChybu(res));
});

// delete
router.delete('/:id', function (req, res) {
  category.delete(req.params.id)
    .then(function (kategorie) {
      res.redirect('/kategorie');
    })
    .catch(vyblejChybu(res));
});

module.exports = router;
