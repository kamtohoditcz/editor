var _ = require('lodash');
var moment = require('moment');

var mongo = require('./mongo');

var collectionName = 'trash';

module.exports = {
  listAll: function () {
    console.log('trash.mongo: calling mongo.listAll');
    return mongo.listAll(collectionName);
  },

  create: function (losDatos) {
    losDatos.creation_date = losDatos.last_edit_date = moment().format();
    return mongo.create(collectionName, losDatos)
      .then((result) => {
        console.log(`MONGO: Created: ` + JSON.stringify(result, null, 2))
        return result.ops[0]._id;
      });
  },

  read: function (id) {
    return mongo.get(collectionName, id)
      .then((result) => {
        console.log(`MONGO: Got for id "${id}": ` + JSON.stringify(result, null, 2));
        return result;
      });
  },

  update: function (id, losDatos) {
    losDatos.last_edit_date = moment().format();
    return mongo.update(collectionName, id, losDatos)
      .then((result) => {
        console.log(`MONGO: Updated [${id}]: ` + JSON.stringify(result, null, 2));
        return result;
      });
  },

  delete: function (id) {
    return mongo.delete(collectionName, id)
      .then((result) => {
        console.log(`MONGO: Deleted [${id}]: ` + JSON.stringify(result, null, 2));
        return result;
      });
  },
}
