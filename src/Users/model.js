const mongoose = require('mongoose');
const log = require('@talkbox/backend-util-logger');
const mailService  = require('../services/email');
const jwt = require('jsonwebtoken');




const verificationRequest = (apiObject, req) => {
    console.log(apiObject);
    var token = jwt.sign({ email : apiObject.email, password: apiObject.password }, 'timtalks');
    return mailService.sendVerificationEmail({
        to: apiObject.email,
        subject: 'Verification Email',
        text: `Hi Your email verification token is http://localhost:3000?emailToken=${token}`
    })
        .then((response) => {
            log.info("email send successfully");
            console.log(response)
            return true
        })
        .catch(err => {
            return false
        })
};



const emailVerificationVerify = (apiObject, req) => {
    console.log(apiObject.emailVerificationToken)

    jwt.verify(apiObject.emailVerificationToken, 'timtalks', ((err, decoded) => {
        if(err) {
            console.log(err)
            return false
        } 

        console.log(decoded)

    }))
        

};



module.exports = {
    verificationRequest: verificationRequest, 
    emailVerificationVerify:emailVerificationVerify
};
