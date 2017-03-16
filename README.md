KamToHodit.cz BE
================

mongodb:
 * install and configure yourself, mostly default ;)
 * when you finish it should run on localhost:27017
 * alternatively: you can use `mongo-mock` by setting the `MONGOMOCK=true` environment variable (see below on setting those)

node:
 * recommended: install [nvm](https://github.com/creationix/nvm) and run `nvm use 7.6`
 * `git clone git@github.com:michalkral/kamtohodit.git`
 * `npm install`
 * `npm start`
 * go to [localhost:3000](http://localhost:3000)
 * ;) 

api:
 * search api accepts queries like this: [http://localhost:3000/odpadky?q=neasi&t=json](http://localhost:3000/odpadky?q=neasi&t=json)

setting environment variable:
 * put the variable `VARIABLE=value` into `.env` file in root of the project
 * run application like `VARIABLE=value npm start`
 * set the variable like `export VARIABLE=VALUE` and then run the app normally with `npm start`

