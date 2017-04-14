var mongodb = require('mongodb');

// Use mongo-mock if you don't want to install mongo ;)
// See: https://github.com/williamkapke/mongo-mock
if (process.env.MONGOMOCK) {
  var mongodb = require('mongo-mock');
  mongodb.max_delay = 0;
  console.log('Using mongo-mock instead of native mongo driver!')
}

var { MongoClient, ObjectID } = mongodb;

// Connection URL
var mongoDbUrl = 'mongodb://localhost:27017/kamtohodit';

var handleError = (err) => {
  console.log("ERROR::MONGODB::error occured", err);
};

var performOperation = (collectionName, operationFunction) => {
  console.log('START - performOperation');

  // Connect to db
  var connectPromise = MongoClient.connect(mongoDbUrl);

  // Get the collection and perform the operation
  var operationPromise = connectPromise
    .then(db => db.collection(collectionName))
    .then(operationFunction);
  // .catch(handleError);

  // Close db connection when operation finishes
  operationPromise.then(() => {
    connectPromise.then(db => db.close());
  })

  return operationPromise;
}

// -----------------------------------------------------------------------------


module.exports = mymongo = {

  create: (collectionName, documentValue) => {
    console.log(`START - mymongo.create("${collectionName}", ${JSON.stringify(documentValue)})`);
    return performOperation(collectionName, (collection) => {

      // See: http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#insertOne
      return collection.insertOne(documentValue);

    });
  },

  update: (collectionName, documentId, documentValue) => {
    console.log(`START - mymongo.update("${collectionName}", "${documentId}", ${JSON.stringify(documentValue)})`);
    return performOperation(collectionName, (collection) => {

      // See: http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#updateOne
      return collection.updateOne({ _id: new ObjectID(documentId) }, { $set: documentValue });

    });
  },

  delete: (collectionName, documentId) => {
    console.log(`START - mymongo.delete("${collectionName}", "${documentId}")`);
    return performOperation(collectionName, (collection) => {

      // See: http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#deleteOne
      return collection.deleteOne({ _id: new ObjectID(documentId) });

    });
  },

  // See: http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#find
  find: (collectionName, findOptions) => {
    console.log(`START - mymongo.find("${collectionName}", ${findOptions})`);
    return performOperation(collectionName, (collection) => {

      var cursor;

      if (findOptions) {
        // perform the find
        cursor = collection.find(findOptions.query, findOptions.projection);

        // sort the results
        if (findOptions.map) { cursor.map(findOptions.map); }
        if (findOptions.sort) { cursor.sort(findOptions.sort); }

        // pagination
        // if (findOptions.skip) { cursor.skip(findOptions.skip); }
        // if (findOptions.limit) { cursor.limit(findOptions.limit); }

      } else {
        cursor = collection.find({});
      }
      var documentsArrayPromise = cursor.toArray();
      //documentsArrayPromise.then((data) => { console.log('found data: ', data); })
      return documentsArrayPromise;

    });
  },

  findOne: (collectionName, findOptions) => {
    console.log(`START - mymongo.find("${collectionName}", ${JSON.stringify(findOptions)})`);
    return performOperation(collectionName, (collection) => {

      // See: http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#findOne
      var documentPromise = collection.findOne(findOptions.query);
      return documentPromise;

    });
  },

  // ---------------------------------------------------------------------------

  get: (collectionName, documentId) => {
    return mymongo.findOne(collectionName, {query: {_id: new ObjectID(documentId)}});
  },

  listAll: (collectionName) => {
    return mymongo.find(collectionName);
  },

}
