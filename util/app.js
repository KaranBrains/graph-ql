const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

/** define init express - code expanded */
const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
/** define init express - or simply */
// const app = backendExpress.app;

/** project schema */
const schema = require('./schema');
/** sample schema */
// const schema = require('./schema.sample');

const getErrorCode = require('./error');

/** add /graphql controller */
app.use('/graphql', require('express-graphql').graphqlHTTP({
    schema: schema,
    rootValue: require('../binding'),
    graphiql: true,
    formatError: (err) => {
        const error = getErrorCode(err.message)
        if (error) {
            return ({ message: error.message, statusCode: error.statusCode })
        } else {
            return ({ message: err.message , statusCode: 400 })
        }
    }
}));

module.exports = app;