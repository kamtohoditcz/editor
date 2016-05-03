var _ = require('lodash');
var es = require('./elastic');

var odpadyOdpadek = function (options) {
	return _.assign({
		index: 'odpadky',
		type: 'odpadek'
	}, options);
};

var esResults2docs = function (results) {
	// unwrap the resulting documents and add the 'id' property
	return results.hits.hits.map(function (hit) {
		return _.assign(hit._source, {id: hit._id});
	});
}

module.exports = {
	listAllTrash: function () {
		return es.search(odpadyOdpadek())
		.then(esResults2docs);
	},

	getTrashById: function (id) {
		return es.get(odpadyOdpadek({id: id}))
		.then(function (resp) {
			return resp._source
		});
	},

	// TODO
	deleteTrashById: function (id) {
		return es.delete(odpadyOdpadek({id: id}));
	},
}
