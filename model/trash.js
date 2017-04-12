var _ = require('lodash');
var moment = require('moment');

var mongo = require('./mongo');

var collectionName = 'trash';

module.exports = {
  listAll: function (text) {
    console.log('MONGO: Calling mongo.listAll');
    if (text) {
      return mongo.findText(collectionName, text);
    } else {
      return mongo.listAll(collectionName);
    }
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

  listCategories: function (prefix) {
    let findOptions = {
      query: {},
      projection: {category: 1, _id: 0},
    };
    if (prefix) {
      findOptions.query = {
        category: { $regex: `^${prefix}`},
      }
    }
    return mongo.find(collectionName, findOptions)
      .then((kts) => {
        return kts.map(o => o.category) // { category: "asdf" } --> "asdf"
                  .filter(k => k) // omit null values
                  .sort() // sort ;)
                  .filter(function(el, i, a){ return i == a.length - 1 || a[i + 1] != el ; }); //uniq
      });
  },
}
