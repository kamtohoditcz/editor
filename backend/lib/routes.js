var controller = require('./controller');
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

module.exports = function (app, config) {

// root - redirect to list
app.get('/', function(req, res) {
	res.redirect('/odpadky');
});

// list
app.get('/odpadky', function(req, res) {
	controller
	.listAllTrash()
	.then(function(odpadky){
		res.render('odpadky', {
			odpadky: odpadky
		});
	})
	.catch(vyblejChybu(res));
});

// TODO neexistuje nejaky framework na CRUD? to je napicu si takle psat vsechno ruco.

// create - put
app.get('/odpadky/novy', function (req, res) {
	console.log('supame tam novy bordylek');
	res.render('odpadek-novy');
});

// create - post
app.post('/odpadky/novy', function (req, res) {
	var losDatos = req.body;
	controller
	.createTrash(losDatos)
	.then(function(id){
		res.redirect('/odpadky/' + id);
	})
	.catch(vyblejChybu(res));
});

// read
app.get('/odpadky/:id', function (req, res) {
	controller
	.getTrashById(req.params.id)
	.then(convertDates)
	.then(function(odpadek){
		res.render('odpadek', odpadek);
	})
	.catch(vyblejChybu(res));
});

// update - get
app.get('/odpadky/:id/upravit', function (req, res) {
	controller
	.getTrashById(req.params.id)
	.then(function(odpadek){
		res.render('odpadek-upravit', odpadek);
	})
	.catch(vyblejChybu(res));
});

// update - post
app.post('/odpadky/:id/upravit', function (req, res) {
	var id = req.params.id;
	var losDatos = req.body;
	console.log('Upravujem fella ' + id + ':', losDatos);
	controller
	.updateTrashById(id, losDatos)
	.then(function(odpadek){
		res.redirect('/odpadky/' + id);
	})
	.catch(vyblejChybu(res));
});

// delete
app.delete('/odpadky/:id', function (req, res) {
	controller
	.deleteTrashById(req.params.id)
	.then(function (odpadek) {
		res.redirect('/odpadky');
	})
	.catch(vyblejChybu(res));
});


}
