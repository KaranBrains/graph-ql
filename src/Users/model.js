const mongoose = require('mongoose');
const log = require('@talkbox/backend-util-logger');
const mailService  = require('../services/email');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { errorName } = require('../constants/errors')

const mediaSchema = new mongoose.Schema({
    url : {
        type: String
    },
    title : {
        type: String
    },
    description : {
        type: String
    },
})

const fileSchema = new mongoose.Schema({
    url : {
        type: String
    },
})

const userSchema = new mongoose.Schema({
    email : {
        type: String,
        unique: true,
        required: true,
    },    
    password : {
        type: String,
        required: true,
    },
    facebookId : {
        type: String
    },
    appleId : {
        type: String
    },
    // countryCode : {
    //     type: String
    // },
    // phone : {
    //     type: String
    // },
    profilePic : fileSchema ,
    chineseName : {
        type: String
    },
    bio : {
        type: String
    },
    acceptTnc : {
        type: Boolean
    },
    introductionVideo : mediaSchema,
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
    studyMedia : mediaSchema,
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
    currentJobMedia : mediaSchema,
    accomplishmentName : {
        type: String
    },
    accomplishmentMedia : mediaSchema,
    otherMedia : mediaSchema,
    skillName : {
        type: String
    },
    skillMedia : mediaSchema,
    createDate : {
        type: Number
    },
    lastUpdate : {
        type: Number
    },
    lastUpdateBy : {
        type: String
    },
    approved : {
        type: String
    },
    isProfileCompleted : {
        type: Boolean
    },
});

userSchema.pre('save', function (next) {
    const user = this;
  
    if (!user.isModified('password')) return next();
  
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return next(err);
  
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
  
        user.password = hash;
        next();
      });
    });
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

const publicUserRegister = async (apiObject, req) => {
    try {
        const incomingUser = {
            email: apiObject.input.fields.email,
            password: apiObject.input.credential.password
        }
        let user = await User.findOne({ email: apiObject.input.fields.email });
        if (!user) {
            return new User(incomingUser).save()
            .then(result => {
                if (result) log.info("User", "create|"+result._id);
                return result;
            })
            .catch(err=>{
                throw err;
            });
        } else {
            throw new Error(errorName.ALREADY_EXISTS)
        }
      } catch (err) {
            throw err
      }
};

const meUpdate = async (apiObject, req) => {
    try {   
            const profilePic = apiObject.input.fields.profilePicBase64 ? {
                url : apiObject.input.fields.profilePicBase64
            } : null;

            const introductionVideo = apiObject.input.fields.introductionVideoBase64 ? {
                url : apiObject.input.fields.introductionVideoBase64.inputBase64 ? apiObject.input.fields.introductionVideoBase64.inputBase64 : null,
                title : apiObject.input.fields.introductionVideoBase64.title ? apiObject.input.fields.introductionVideoBase64.title : null,
                description : apiObject.input.fields.introductionVideoBase64.description ? apiObject.input.fields.introductionVideoBase64.description : null,
            } : null;

            const studyMedia = apiObject.input.fields.studyMedia ? {
                url : apiObject.input.fields.studyMedia.inputBase64 ? apiObject.input.fields.studyMedia.inputBase64 : null,
                title : apiObject.input.fields.studyMedia.title ? apiObject.input.fields.studyMedia.title : null,
                description : apiObject.input.fields.studyMedia.description ? apiObject.input.fields.studyMedia.description : null,
            } : null;

            const currentJobMedia = apiObject.input.fields.currentJobMedia ? {
                url : apiObject.input.fields.currentJobMedia.inputBase64 ? apiObject.input.fields.currentJobMedia.inputBase64 : null,
                title : apiObject.input.fields.currentJobMedia.title ? apiObject.input.fields.currentJobMedia.title : null,
                description : apiObject.input.fields.currentJobMedia.description ? apiObject.input.fields.currentJobMedia.description : null,
            } : null;

            
            const accomplishmentMedia = apiObject.input.fields.accomplishmentMedia ? {
                url : apiObject.input.fields.accomplishmentMedia.inputBase64 ? apiObject.input.fields.accomplishmentMedia.inputBase64 : null,
                title : apiObject.input.fields.accomplishmentMedia.title ? apiObject.input.fields.accomplishmentMedia.title : null,
                description : apiObject.input.fields.accomplishmentMedia.description ? apiObject.input.fields.accomplishmentMedia.description : null,
            } : null;

            const otherMedia = apiObject.input.fields.otherMedia ? {
                url : apiObject.input.fields.otherMedia.inputBase64 ? apiObject.input.fields.otherMedia.inputBase64 : null,
                title : apiObject.input.fields.otherMedia.title ? apiObject.input.fields.otherMedia.title : null,
                description : apiObject.input.fields.otherMedia.description ? apiObject.input.fields.otherMedia.description : null,
            } : null;

            const skillMedia = apiObject.input.fields.skillMedia ? {
                url : apiObject.input.fields.skillMedia.inputBase64 ? apiObject.input.fields.skillMedia.inputBase64 : null,
                title : apiObject.input.fields.skillMedia.title ? apiObject.input.fields.skillMedia.title : null,
                description : apiObject.input.fields.skillMedia.description ? apiObject.input.fields.skillMedia.description : null,
            } : null;

            let incomingUser = {
                countryCode: apiObject.input.fields.countryCode ? apiObject.input.fields.countryCode : null, 
                phone: apiObject.input.fields.phone ? apiObject.input.fields.phone : null,
                profilePic: profilePic,
                skillMedia: skillMedia,
                otherMedia : otherMedia,
                accomplishmentMedia : accomplishmentMedia,
                currentJobMedia : currentJobMedia,
                studyMedia : studyMedia,
                introductionVideo : introductionVideo,
                chineseName: apiObject.input.fields.chineseName ? apiObject.input.fields.chineseName : null,
                bio: apiObject.input.fields.bio ? apiObject.input.fields.bio : null,
                acceptTnc: apiObject.input.fields.acceptTnc ? apiObject.input.fields.acceptTnc : null,
                interestedEmploymentType: apiObject.input.fields.interestedEmploymentType ? apiObject.input.fields.interestedEmploymentType : null,
                interestedIndustry: apiObject.input.fields.interestedIndustry ? apiObject.input.fields.interestedIndustry : null,
                school: apiObject.input.fields.school ? apiObject.input.fields.school : null,
                industry: apiObject.input.fields.industry ? apiObject.input.fields.industry : null,
                degree: apiObject.input.fields.degree ? apiObject.input.fields.degree : null,
                language: apiObject.input.fields.language ? apiObject.input.fields.language : null,
                fieldOfStudy: apiObject.input.fields.fieldOfStudy ? apiObject.input.fields.fieldOfStudy : null,
                studyStartYear: apiObject.input.fields.studyStartYear ? apiObject.input.fields.studyStartYear : null,
                studyEndYear: apiObject.input.fields.studyEndYear ? apiObject.input.fields.studyEndYear : null,
                studyDescription: apiObject.input.fields.studyDescription ? apiObject.input.fields.studyDescription : null,
                studyTitle: apiObject.input.fields.studyTitle ? apiObject.input.fields.studyTitle : null,
                employmentType: apiObject.input.fields.employmentType ? apiObject.input.fields.employmentType : null,
                companyName: apiObject.input.fields.companyName ? apiObject.input.fields.companyName : null,
                currentJob: apiObject.input.fields.currentJob ? apiObject.input.fields.currentJob : null,
                currentJobStartYear: apiObject.input.fields.currentJobStartYear ? apiObject.input.fields.currentJobStartYear : null,
                accomplishmentName: apiObject.input.fields.accomplishmentName ? apiObject.input.fields.accomplishmentName : null,
                skillName: apiObject.input.fields.skillName ? apiObject.input.fields.skillName : null,
                isProfileCompleted: apiObject.input.fields.isProfileCompleted ? apiObject.input.fields.isProfileCompleted : null,
            }
            if (!apiObject.input.fields.email) {
                throw new Error(errorName.EMAIL_MISSING)
            }
            let user = await User.findOne({ email: apiObject.input.fields.email });
            if (!user) {
                throw new Error(errorName.DOESNT_EXISTS)
                // return new User(incomingUser).save()
                // .then(result => {
                //     if (result) log.info("User", "create|"+result._id);
                //     return result;
                // })
                // .catch(err=>{
                //     throw err;
                // });
            } else {
                return User.findOneAndUpdate({ email: apiObject.input.fields.email }, incomingUser, {new: true})
                .then(result => {
                    if (result) log.info("User", "update|"+result._id);
                    console.log(result);
                    return result;
                })
                .catch(err=>{
                    console.log(err);
                    throw err;
                });
            }
        } catch (err) {
            console.log(err);
            throw err
        }
};



module.exports = {
    verificationRequest: verificationRequest, 
    emailVerificationVerify: emailVerificationVerify,
    publicUserRegister: publicUserRegister,
    meUpdate: meUpdate
};
