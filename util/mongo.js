const mongoose = require('mongoose');
// const url = 'mongodb://'+process.env.MONGODB_USERNAME+":"+process.env.MONGODB_PASSWORD+"@"+process.env.MONGODB_HOST+"/"+process.env.MONGODB_DB +"?" + process.env.MONGODB_OPTION;
const url = 'mongodb://localhost:27017/anita';
const connect = (callback) => {
    // console.log(url);
    mongoose.connect(url, {useNewUrlParser: true, useFindAndModify: false});
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', callback);
};

module.exports = {
    'connect': connect
};