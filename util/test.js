const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);
const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;

const expressTest = require('@talkbox/backend-test-util-express');

const User = require('./permission').User;
const Token = require('./permission').Token;
const app = require('./app');

const tokenHeaderKey = 'x-token';
const userCredential = '60757d9700e891f8eb417ec5';
const adminCredential = '60757e68a8ac0d534ff99310';

const initData = () => {
    mongoose.connection.dropDatabase();
    //normal user
    new User({
        _id: "60757f0f9831c3e8a9f22387",
        type: ["public"]
    }).save();
    new Token({
        _id: "60757d9700e891f8eb417ec5",
        userId: "60757f0f9831c3e8a9f22387"
    }).save();
    //admin user
    new User({
        _id: "60757f1d95a9419597ac69b2",
        type: ["admin"]
    }).save();
    new Token({
        _id: "60757e68a8ac0d534ff99310",
        userId: "60757f1d95a9419597ac69b2"
    }).save();
};

const initTest = () => {
    let mongoServer;
    const opts = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };

    before(done => {
        mongoServer = new MongoMemoryServer();
        mongoServer.getUri()
            .then(mongoUri => {
                mongoose.connect(mongoUri, opts)
                    .then(() => {
                        done();
                    });
            });
    });

    beforeEach(done => {
        done();
    });

    after(done => {
        mongoose.disconnect()
            .then(() => {
                mongoServer.stop()
                    .then(() => {
                        done();
                    });
            });
    });
};

module.exports = {
    initTest: initTest,
    initData: initData,
    methods: {
        query: (query) =>
            expressTest.methods.graphqlQuery(app, query)
        ,
        queryWithCredentials: (query) =>
            expressTest.methods.graphqlQuery(app, query)
                .set(tokenHeaderKey, userCredential)
        ,
        queryWithAdminCredentials: (query) =>
            expressTest.methods.graphqlQuery(app, query)
                .set(tokenHeaderKey, adminCredential)
        ,
    }
};