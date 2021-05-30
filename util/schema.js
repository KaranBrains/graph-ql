/**
 *
 * this is project schema
 *
 * */
module.exports = require('graphql').buildSchema(`
        enum Role {
            pwd, employer, ngo, public
        },
        enum EmploymentType {
            freelance, contract, fullTime, partTime
        },
        enum Industry {
            designArt,
            graphicDesign,
            illustrationDrawing,
            animationDesign,
            webDesign
        },
        enum School {
            hku
        },
        enum Degree {
            bba
        },
        enum Language {
            en, zh
        },
        input MediaInput {
            inputBase64: String,
            title: String,
            description: String
        },
        
        input PublicUserFieldsInput {
            email: String!,
            countryCode: String,
            phone: String,
            profilePicBase64: String,
            chineseName: String,
            bio: String,
            acceptTnc: Boolean,
            introductionVideoBase64: MediaInput,
            interestedEmploymentType: EmploymentType,
            interestedIndustry: Industry,
            school: School,
            degree: Degree,
            fieldOfStudy: String,
            studyStartYear: String,
            studyEndYear: String,
            studyDescription: String,
            studyMedia: MediaInput,
            studyTitle: String,
            employmentType: EmploymentType,
            companyName: String,
            industry: Industry,
            currentJob: Boolean,
            currentJobStartYear: String,
            currentJobEndYear: String,
            currentJobDescription: String
            currentJobMedia: MediaInput,
            language: Language,
            accomplishmentName: String,
            accomplishmentMedia: MediaInput,
            otherMedia: MediaInput,
            skillName: String,
            skillMedia: MediaInput,
            isProfileCompleted: Boolean
        }
        input UserCreateCredentialInput {
            password: String,
            emailVerificationToken: String,
            googleToken: String,
            facebookToken: String,
            appleToken: String,
            phoneOtp: String
        }
        input PublicUserRegisterInput {
            credential: UserCreateCredentialInput,
            fields: PublicUserFieldsInput
        },
        input UserUpdateCredentialInput {
            password: String
        },
        input UserUpdateInput {
            credential: UserUpdateCredentialInput,
            fields: PublicUserFieldsInput,
        },
        input LoginInput {
            email: String!,
            password: String,
            googleToken: String,
            facebookToken: String,
            appleToken: String,
            countryCode: String,
            phone: String,
            phoneOtp: String
        },
        input RegisterInput {
            email: String!,
            password: String!
        },
        input ForgetPasswordInput {
            forgetPasswordToken: String!,
            newPassword: String!
        },
        type Media {
            _id: String!,
            url: String!,
            title: String,
            description: String
        },
        type File {
            _id: String!,
            url: String!
        },
        type User {
            _id: ID!,
            roles: [Role]!,
            email: String!,
            password: String,
            facebookId: String,
            appleId: String,
            profilePic: File,
            chineseName: String,
            bio: String,
            acceptTnc: Boolean,
            introductionVideo: Media,
            interestedEmploymentType: EmploymentType,
            interestedIndustry: Industry,
            school: School,
            degree: Degree,
            fieldOfStudy: String,
            studyStartYear: String,
            studyEndYear: String,
            studyDescription: String,
            studyMedia: Media,
            studyTitle: String,
            employmentType: EmploymentType,
            companyName: String,
            industry: Industry,
            currentJob: Boolean,
            currentJobStartYear: String,
            currentJobEndYear: String,
            currentJobDescription: String
            currentJobMedia: Media,
            language: Language,
            accomplishmentName: String,
            accomplishmentMedia: Media,
            otherMedia: Media,
            skillName: String,
            skillMedia: Media,
            createDate: Float,
            lastUpdate: Float,
            lastUpdateBy: ID,
            approved: Boolean,
            isProfileCompleted: Boolean
        },
        type Query {
            "header: x-token, require 'adminUser'"
            userGet(id: ID!): User,
            
            "header: x-token, require 'adminUser'"
            userList: [User],
            
            "header: x-token, require 'anyUser'"
            me: [User],
        },
        type Mutation {
            emailVerificationRequest(email: String!, password: String!): Boolean,
            
            emailVerificationVerify(emailVerificationToken: String!): Boolean,
            
            phoneVerificationRequest(countryCode: String!, phone: String!): Boolean,
            
            publicUserRegister(input: PublicUserRegisterInput!): User,
            
            login(input: LoginInput!): User,

            "header: x-token, require 'anyUser'"
            logout: Boolean,
            
            "header: x-token, require 'anyUser'"

            meUpdate(input: UserUpdateInput): User,
            
            forgetPasswordRequest(email: String!): Boolean,
            
            forgetPasswordVerify(forgetPasswordToken: String!): Boolean,
            
            forgetPasswordSubmit(input: ForgetPasswordInput!): Boolean
        }
    `);
