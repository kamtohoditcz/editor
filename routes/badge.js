var badge = require('../model/badge');
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
var convertDates = function (badge) {
  badge.creation_date = moment(badge.creation_date).locale('cs').calendar();
  badge.last_edit_date = moment(badge.last_edit_date).locale('cs').fromNow();
  return badge;
}

// -----------------------------------------------------------------------------

// list
router.get('/', function (req, res) {
  var q = req.query.q;
  var t = req.query.t;
  badge.listAll(q).then(function (badges) {
    // console.log(`Accept: ${req.get('Accept')}`);
    if (t === 'json') {
      // console.log('returning json', badges);
      res.json(badges);
    } else {
      // console.log('rendering badge/list', badges);
      res.render('badge/list', {
        badges: badges
      });
    }
  }).catch(vyblejChybu(res));
});

// TODO neexistuje nejaky framework na CRUD? to je napicu si takle psat vsechno ruco.

// create - put
router.get('/novy', function (req, res) {
  res.render('badge/form');
});

// create - put
router.put('/', function (req, res) {
  var losDatos = req.body;
  badge.create(losDatos)
    .then(function (id) {
      res.redirect(`/badges/${id}`);
    })
    .catch(vyblejChybu(res));
});

// read
router.get('/:id', function (req, res) {
  badge.read(req.params.id)
    .then((badge) => {
      if (!badge) {
        // TODO show some "do you want to create message?"
        res.redirect('/badges');
      } else {
        res.render('badge/show', convertDates(badge));
      }
    })
    .catch(vyblejChybu(res));
});

// update - get
router.get('/:id/upravit', function (req, res) {
  badge.read(req.params.id)
    .then(function (badge) {
      res.render('badge/form', badge);
    })
    .catch(vyblejChybu(res));
});

// update - post
router.post('/:id', function (req, res) {
  var id = req.params.id;
  var losDatos = req.body;
  badge.update(id, losDatos)
    .then(function (badge) {
      res.redirect(`/badges/${id}`);
    })
    .catch(vyblejChybu(res));
});

// delete
router.delete('/:id', function (req, res) {
  badge.delete(req.params.id)
    .then(function (badge) {
      res.redirect('/badges');
    })
    .catch(vyblejChybu(res));
});

module.exports = router;
