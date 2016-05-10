var trash = require('../model/trash');
var category = require('../model/category');

var express = require('express');
var router = express.Router();
var moment = require('moment');

var vyblejChybu = function (res) {
	return function (err) {
		res
		.status(500)
		.write(err)
		.end();
	}
}

var convertDates = function (odpadek) {
	odpadek.creation_date = moment(odpadek.creation_date).locale('cs').calendar();
	odpadek.last_edit_date = moment(odpadek.last_edit_date).locale('cs').fromNow();
	return odpadek;
}


// list
router.get('/', function (req, res) {
	trash.listAll()
	.then(function(odpadky){
		res.render('odpadek/odpadky', {
			odpadky: odpadky
		});
	})
	.catch(vyblejChybu(res));
});

// TODO neexistuje nejaky framework na CRUD? to je napicu si takle psat vsechno ruco.

// create - put
router.get('/novy', function (req, res) {
	res.render('odpadek/odpadek-novy');
});

// create - post
router.post('/novy', function (req, res) {
	var losDatos = req.body;
	trash.create(losDatos)
	.then(function(id){
		res.redirect('/odpadky/' + id);
	})
	.catch(vyblejChybu(res));
});

// read
router.get('/:id', function (req, res) {
	trash.read(req.params.id)
	.then(convertDates)
	.then(function(odpadek){
		res.render('odpadek/odpadek', odpadek);
	})
	.catch(vyblejChybu(res));
});

// update - get
router.get('/:id/upravit', function (req, res) {
	trash.read(req.params.id)
	.then(function(odpadek){
		res.render('odpadek/odpadek-upravit', odpadek);
	})
	.catch(vyblejChybu(res));
});

// update - post
router.post('/:id/upravit', function (req, res) {
	var id = req.params.id;
	var losDatos = req.body;
	trash.update(id, losDatos)
	.then(function(odpadek){
		res.redirect('/odpadky/' + id);
	})
	.catch(vyblejChybu(res));
});

// delete
router.delete('/:id', function (req, res) {
	trash.delete(req.params.id)
	.then(function (odpadek) {
		res.redirect('/odpadky/');
	})
	.catch(vyblejChybu(res));
});

module.exports = router;
