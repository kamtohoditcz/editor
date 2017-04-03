var _ = require('lodash');
var moment = require('moment');

var es = require('./elastic');

var indexType = function (options) {
	return _.assign({
		index: 'odpadky',
		type: 'kategorie'
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
	listAll: function () {
		return es.search(indexType())
		.then(esResults2docs);
	},

	create: function (losDatos) {
		losDatos.creation_date = losDatos.last_edit_date = moment().format();
		return es.create(indexType({body: losDatos}))
		.then(function (result) {
			return result._id;
		});
	},

	read: function (id) {
		return es.get(indexType({id: id}))
		.then(esResult2doc);
	},

	update: function (id, losDatos) {
		losDatos.last_edit_date = moment().format();
		return es.update(indexType({id: id, body: {doc: losDatos}}));
	},

	delete: function (id) {
		return es.delete(indexType({id: id}));
	},
}
