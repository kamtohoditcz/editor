var _ = require('lodash');
var es = require('./elastic');
var moment = require('moment');

var odpadyOdpadek = function (options) {
	return _.assign({
		index: 'odpadky',
		type: 'odpadek'
		//size: 20 by default
	}, options);
};

var esResult2doc = function (result) {
	return _.assign(result._source, {id: result._id});
}

var esResults2docs = function (results) {
	return results.hits.hits.map(esResult2doc);
}

module.exports = {
	listAllTrash: function () {
		return es.search(odpadyOdpadek())
		.then(esResults2docs);
	},

	createTrash: function (losDatos) {
		losDatos.creation_date = losDatos.last_edit_date = moment().formmat();
		return es.create(odpadyOdpadek({body: losDatos}))
		.then(function (result) {
			return result._id;
		});
	},

	getTrashById: function (id) {
		return es.get(odpadyOdpadek({id: id}))
		.then(esResult2doc);
	},

	updateTrashById: function (id, losDatos) {
		losDatos.last_edit_date = moment().format();
		return es.update(odpadyOdpadek({id: id, body: {doc: losDatos}}));
	},

	deleteTrashById: function (id) {
		return es.delete(odpadyOdpadek({id: id}));
	},
}
