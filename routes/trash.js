var trash = require('../model/trash');
//var category = require('../model/category');

var express = require('express');
var router = express.Router();
var moment = require('moment');

var vyblejChybu = function (res) {
  return function (err) {
    // TODO adjust this for production
    res.status(500)
      .write(err)
      .end();
  }
}

// TODO do this automatically using pipes in views
var convertDates = function (odpadek) {
  odpadek.creation_date = moment(odpadek.creation_date).locale('cs').calendar();
  odpadek.last_edit_date = moment(odpadek.last_edit_date).locale('cs').fromNow();
  return odpadek;
}

// -----------------------------------------------------------------------------

// list categories
router.get('/kategorie', function (req, res) {
  var q = req.query.q;
  var t = req.query.t;
  trash.listCategories(q).then(function (kategorie) {
    //if (t === 'json') {
      console.log('returning json', kategorie);
      res.json(kategorie);
    //}
  }).catch(vyblejChybu(res));
});

// list
router.get('/', function (req, res) {
  var q = req.query.q;
  var t = req.query.t;
  trash.listAll(q).then(function (odpadky) {
    // console.log(`Accept: ${req.get('Accept')}`);
    if (t === 'json') {
      // console.log('returning json', odpadky);
      res.json(odpadky);
    } else {
      // console.log('rendering trash/list', odpadky);
      res.render('trash/list', {
        odpadky: odpadky
      });
    }
  }).catch(vyblejChybu(res));
});

// TODO neexistuje nejaky framework na CRUD? to je napicu si takle psat vsechno ruco.

// create - put
router.get('/novy', function (req, res) {
  res.render('trash/form');
});

// create - put
router.put('/', function (req, res) {
  var losDatos = req.body;
  trash.create(losDatos)
    .then(function (id) {
      res.redirect(`/odpadky/${id}`);
    })
    .catch(vyblejChybu(res));
});

// read
router.get('/:id', function (req, res) {
  trash.read(req.params.id)
    .then((odpadek) => {
      if (!odpadek) {
        // TODO show some "do you want to create message?"
        res.redirect('/odpadky');
      } else {
        res.render('trash/show', convertDates(odpadek));
      }
    })
    .catch(vyblejChybu(res));
});

// update - get
router.get('/:id/upravit', function (req, res) {
  trash.read(req.params.id)
    .then(function (odpadek) {
      res.render('trash/form', odpadek);
    })
    .catch(vyblejChybu(res));
});

// update - post
router.post('/:id', function (req, res) {
  var id = req.params.id;
  var losDatos = req.body;
  trash.update(id, losDatos)
    .then(function (odpadek) {
      res.redirect(`/odpadky/${id}`);
    })
    .catch(vyblejChybu(res));
});

// delete
router.delete('/:id', function (req, res) {
  trash.delete(req.params.id)
    .then(function (odpadek) {
      res.redirect('/odpadky');
    })
    .catch(vyblejChybu(res));
});

module.exports = router;
