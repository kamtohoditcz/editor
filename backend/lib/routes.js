var controller = require('./controller');

module.exports = function (app, config) {

// app.get('/', function(req, res) {
//   res.render('master', {
//     homepage: {
//       title: 'page title',
//       items: {
//         _id: 'idcko12312312',
//         title: 'post title'
//       }
//     }
//   });
// });

// get all of them
app.get('/odpadky', function(req, res) {
	controller
	.listAllTrash()
	.then(function(odpadky){
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
	controller
	.getTrashById(req.params.id)
	.then(function(odpadek){
		res.render('odpadek', odpadek);
	});
});

app.delete('/odpadek/:id', function (req, res) {
	controller
	.deleteTrashById(req.params.id)
	.then(function(odpadek){
		res.redirect('/odpadky');
	});
});


}
