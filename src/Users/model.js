const mongoose = require('mongoose');
const log = require('@talkbox/backend-util-logger');
const mailService  = require('../services/email');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email : {
        type: String
    },
    countryCode : {
        type: String
    },
    phone : {
        type: String
    },
    profilePicBase64 : {
        type: String
    },
    chineseName : {
        type: String
    },
    bio : {
        type: String
    },
    acceptTnc : {
        type: Boolean
    },
    introductionVideoBase64 : {
        inputBase64 : {
            type: String
        },
        title : {
            type: String
        },
        description : {
            type: String
        },
    },
    interestedEmploymentType : {
        enum: ['freelance', 'contract', 'fullTime', 'partTime']
    },
    interestedIndustry : {
        enum: ['designArt', 'graphicDesign', 'illustrationDrawing', 'animationDesign' , 'webDesign']
    },
    school : {
        enum: ['hku']
    },
    degree : {
        enum: ['bba']
    },
    language : {
        enum: ['en' , 'zh']
    },
    fieldOfStudy : {
        type: String
    },
    studyStartYear : {
        type: String
    },
    studyEndYear : {
        type: String
    },
    studyDescription : {
        type: String
    },
    studyMedia : {
        inputBase64 : {
            type: String
        },
        title : {
            type: String
        },
        description : {
            type: String
        },
    },
    studyTitle : {
        type: String
    },
    employmentType : {
        enum: ['freelance', 'contract', 'fullTime', 'partTime']
    },
    companyName : {
        type: String
    },
    industry : {
        enum: ['designArt', 'graphicDesign', 'illustrationDrawing', 'animationDesign' , 'webDesign']
    },
    currentJob : {
        type: Boolean
    },
    currentJobStartYear : {
        type: String
    },
    currentJobEndYear : {
        type: String
    },
    currentJobDescription : {
        type: String
    },
    currentJobMedia : {
        inputBase64 : {
            type: String
        },
        title : {
            type: String
        },
        description : {
            type: String
        },
    },
    accomplishmentName : {
        type: String
    },
    accomplishmentMedia : {
        inputBase64 : {
            type: String
        },
        title : {
            type: String
        },
        description : {
            type: String
        },
    },
    otherMedia : {
        inputBase64 : {
            type: String
        },
        title : {
            type: String
        },
        description : {
            type: String
        },
    },
    skillName : {
        type: String
    },
    skillMedia : {
        inputBase64 : {
            type: String
        },
        title : {
            type: String
        },
        description : {
            type: String
        },
    },
    isProfileCompleted : {
        type: Boolean
    },
});

const User = mongoose.model('User', userSchema);



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

const publicUserRegister = (apiObject, req) => {
    console.log(apiObject.input);

    return true;

    // return jwt.verify(apiObject.emailVerificationToken, 'timtalks', ((err, decoded) => {
    //     if(err) {
    //         return false
    //     } 

    //     if(decoded.email && decoded.password && decoded.iat) {
    //         return true;
    //     }

    // }))
        
};



module.exports = {
    verificationRequest: verificationRequest, 
    emailVerificationVerify: emailVerificationVerify,
    publicUserRegister: publicUserRegister
};
