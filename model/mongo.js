var MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

// Connection URL
var mongoDbUrl = 'mongodb://localhost:27017/kamtohodit';

var handleError = (err) => {
  console.log("ERROR::MONGODB::error occured", err);
};

var performOperation = (collectionName, operationFunction) => {
  return MongoClient
    .connect(mongoDbUrl)
    .then(db => db.collection(collectionName))
    .then(operationFunction)
    .catch(handleError);
}

// -----------------------------------------------------------------------------


module.exports = mongo = {

  create: (collectionName, documentValue) => {
    return performOperation(collectionName, (collection) => {
      return collection.insert(documentValue);
    });
  },

  update: (collectionName, documentId, documentValue) => {
    return performOperation(collectionName, (collection) => {
      return collection.updateOne({ _id: documentId }, { $set: { value: documentValue } });
    });
  },

  delete: (collectionName, documentId) => {
    return performOperation(collectionName, (collection) => {
      return collection.deleteOne({ _id: documentId });
    });
  },

  find: (collectionName, findOptions) => {
    return performOperation(collectionName, (collection) => {
      return collection.find(findOptions);
    });
  },

  // ---------------------------------------------------------------------------

  get: (collectionName, documentId) => {
    return mongo.find(collectionName, { _id: documentId });
  },

  listAll: (collectionName) => {
    return mongo.find(collectionName, {});
  },

}
