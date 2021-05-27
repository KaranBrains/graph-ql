const User = require('./model');
const Permission = require('../../util/permission');

module.exports = {
    query: {
        
    },
    mutation: {
        /** verification email Id */
        verificationRequest: ({email, password}, req) => User.verificationRequest({email, password}, req),
        emailVerificationVerify: ({emailVerificationToken}, req) => User.emailVerificationVerify({emailVerificationToken}, req)

    }
};