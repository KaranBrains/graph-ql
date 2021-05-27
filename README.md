# jciep

## Graphql Schema
[schema.js](util/schema.js)

## Project Structure
* [app.js](app.js) `runner class for your testing, you may add your express middleware for debug here`
* [binding.js](binding.js) `bind your query and mutation functions here`
* [util](util)
  * [schema.js](util/schema.js) `graphql schema of this project`
  * [schema.sample.js](util/schema.sample.js) `graphql schema of the sample code that comes along with this project initially`
  * [app.js](autil/pp.js) `init express`
  * [mongo.js](util/mongo.js) `connect mongo using mongoose`
  * [permission.js](util/permission.js) `project-based permission checking methods for queries and mutations`
  * [test.js](util/test.js) `testing functions, including graphql request methods with credentials`
* [test](test)
  * [test.js](test/test.js) `test runner, include all tests here`
* [src](src) `put all your source code here, you may feel free to add more classes here`
  * [functions.js](src/functions.js) `sample query and mutation functions with permission checking`
  * [model.js](src/model.js) `sample model with create, update and delete logics`
  * [test.js](src/test.js) `sample test cases`
  
## What you should do
1. Try running sample code (instructions below)
2. Remember to change the schema back to project schema (revert step 2 of `How to run sample code`) 
2. Identify the queries and mutations that you will need to complete at [util/schema.js](util/schema.js)
3. Replace the source code under [src](src) according to your requirements
4. Update [binding.js](binding.js) according to your query and mutation functions 

## How to run sample code
1. After cloning the project
2. Edit file [util/app.js](util/app.js) 
    1. Comment line 15 `const schema = require('./schema');`
    2. Uncomment line 17 `const schema = require('./schema.sample');`
3. Run server by instructions in `How to run local server`
4. Run test cases by instructions in `How to run test cases`

## How to run local server
1. Setup environment variables
    1. `MONGODB_USERNAME` mongodb username
    2. `MONGODB_PASSWORD` mongodb password
    3. `MONGODB_HOST` mongodb host / IP
    4. `MONGODB_DB` mongodb database name
    5. `MONGODB_OPTION` mongodb connection option, e.g. authSource=admin
2. Run [app.js](app.js)

## How to run test cases
1. Open terminal
2. cd to project folder
3. Execute `mocha`

