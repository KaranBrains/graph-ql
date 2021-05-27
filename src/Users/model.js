const mongoose = require('mongoose');
const log = require('@talkbox/backend-util-logger');
const mailService  = require('../services/email');
const jwt = require('jsonwebtoken');




const verificationRequest = (apiObject, req) => {
    console.log(apiObject);
    var token = jwt.sign({ email : apiObject.email, password: apiObject.password }, 'timtalks',{
        expiresIn: 60 * 15// expires in 15 minutes
      });
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

    return jwt.verify(apiObject.emailVerificationToken, 'timtalks', ((err, decoded) => {
        if(err) {
            return false
        } 

        if(decoded.email && decoded.password && decoded.iat) {
            return true;
        }

    }))
        
};



module.exports = {
    verificationRequest: verificationRequest, 
    emailVerificationVerify:emailVerificationVerify
};
