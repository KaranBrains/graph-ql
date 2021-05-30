/**
 * Sample test class
 */
const assert = require('chai').assert;
const initData = require('../../util/test').initData;
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
    test: (methods) => {
        
        before(initData);

        describe('user', () => {

            describe('emailVerificaionQuery', () => {
                it('success', function(done){
                    this.timeout(0);
                    const emailVerificaionQuery = {query:"mutation { emailVerificationRequest(email:\"karanbains.bains@gmail.com\",password:\"1234\")}"};
                    methods.query(emailVerificaionQuery)
                    .end((err, res) => {
                        assert.equal(res.body.data.emailVerificationRequest, true);
                        done();
                    });
                });

                it('Missing Email', function(done){
                    this.timeout(0);
                    const emailVerificaionQuery = {query:"mutation { emailVerificationRequest(email:\"\",password:\"1234\")}"};
                    methods.query(emailVerificaionQuery)
                    .end((err, res) => {
                        assert.equal(res.body.errors[0].message, "You need to send all entries.");
                        assert.equal(res.body.errors[0].statusCode, "401");
                        done();
                    });
                });

                it('Wrong Email', function(done){
                    this.timeout(0);
                    const emailVerificaionQuery = {query:"mutation { emailVerificationRequest(email:\"karan\",password:\"1234\")}"};
                    methods.query(emailVerificaionQuery)
                    .end((err, res) => {
                        assert.equal(res.body.errors[0].message, "No recipients defined");
                        assert.equal(res.body.errors[0].statusCode, "400");
                        done();
                    });
                });

                it('Missing Password', function(done){
                    this.timeout(0);
                    const emailVerificaionQuery = {query:"mutation { emailVerificationRequest(email:\"karanbains.bains@gmail.com\",password:\"\")}"};
                    methods.query(emailVerificaionQuery)
                    .end((err, res) => {
                        assert.equal(res.body.errors[0].message, "You need to send all entries.");
                        assert.equal(res.body.errors[0].statusCode, "401");
                        done();
                    });
                });
            });

            describe('emailVerificationRequest', () => {
                it('expired token', function(done){
                    this.timeout(0);
                    const expiredToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImthcmFuYmFpbnMuYmFpbnNAZ21haWwuY29tIiwicGFzc3dvcmQiOiIxMjM0IiwiaWF0IjoxNjIyMzgwNjI4LCJleHAiOjE2MjIzODE1Mjh9.mpFozCVxcQP_ei9BnMFT3KaXQ09AguG47B1WLFOvyPA";
                    const emailVerificaionRequest = {query:`mutation { emailVerificationVerify(emailVerificationToken:"${expiredToken}")}`};
                    methods.query(emailVerificaionRequest)
                    .end((err, res) => {
                        assert.equal(res.body.data.emailVerificationVerify, false);
                        done();
                    });
                });

                it('valid token', function(done){
                    this.timeout(0);
                    const validToken = jwt.sign({ email : "karanbains.bains@gmail.com", password: "123456" }, process.env.jwtSecret,{
                        expiresIn: 60 * 15// expires in 15 minutes
                    });
                    const emailVerificaionRequest = {query:`mutation { emailVerificationVerify(emailVerificationToken:"${validToken}")}`};
                    methods.query(emailVerificaionRequest)
                    .end((err, res) => {
                        assert.equal(res.body.data.emailVerificationVerify, true);
                        done();
                    });
                });

                it('Empty input', function(done){
                    this.timeout(0);
                    const emailVerificaionRequest = {query:`mutation { emailVerificationVerify(emailVerificationToken:"")}`};
                    methods.query(emailVerificaionRequest)
                    .end((err, res) => {
                        assert.equal(res.body.errors[0].message, "You need to send all entries.");
                        assert.equal(res.body.errors[0].statusCode, "401");
                        done();
                    });
                });

                it('Wrong secret token', function(done){
                    this.timeout(0);
                    const wrongSecretToken = jwt.sign({ email : "karanbains.bains@gmail.com", password: "123456" }, 'abcd',{
                        expiresIn: 60 * 15// expires in 15 minutes
                    });
                    const emailVerificaionRequest = {query:`mutation { emailVerificationVerify(emailVerificationToken:"${wrongSecretToken}")}`};
                    methods.query(emailVerificaionRequest)
                    .end((err, res) => {
                        assert.equal(res.body.data.emailVerificationVerify, false);
                        done();
                    });
                });

                it('Token without decoded email or password', function(done){
                    this.timeout(0);
                    const wrongToken = jwt.sign({ email : "karanbains.bains@gmail.com"}, process.env.jwtSecret,{
                        expiresIn: 60 * 15// expires in 15 minutes
                    });
                    const emailVerificaionRequest = {query:`mutation { emailVerificationVerify(emailVerificationToken:"${wrongToken}")}`};
                    methods.query(emailVerificaionRequest)
                    .end((err, res) => {
                        assert.equal(res.body.data.emailVerificationVerify, false);
                        done();
                    });
                });

                it('Invalid Token', function(done){
                    this.timeout(0);
                    const invalidToken = "abcd";
                    const emailVerificaionRequest = {query:`mutation { emailVerificationVerify(emailVerificationToken:"${invalidToken}")}`};
                    methods.query(emailVerificaionRequest)
                    .end((err, res) => {
                        assert.equal(res.body.data.emailVerificationVerify, false);
                        done();
                    });
                });
            });

            describe('publicUserRegister', () => {
                it('success', function(done){
                    this.timeout(0);
                    const publicUserRegister = {
                        query: `mutation {
                                publicUserRegister(input: {
                                        fields: {
                                        email: "test12345@gmail.com"
                                        },
                                        credential: {
                                        password:"test12345"
                                        }
                                }) 
                                {
                                    _id,
                                    email
                                }
                            }`
                    };
                    methods.query(publicUserRegister)
                    .end((err, res) => {
                        assert.equal(res.body.data.publicUserRegister.email, "test12345@gmail.com");
                        done();
                    });
                });

                it('already exists', function(done){
                    this.timeout(0);
                    const publicUserRegister = {
                        query: `mutation {
                                publicUserRegister(input: {
                                        fields: {
                                        email: "test1234@gmail.com"
                                        },
                                        credential: {
                                        password:"test1234"
                                        }
                                }) 
                                {
                                    _id,
                                    email
                                }
                            }`
                    };
                    methods.query(publicUserRegister)
                    .end((err, res) => {
                        assert.equal(res.body.errors[0].message, "The user already exists.");
                        assert.equal(res.body.errors[0].statusCode, 401);
                        done();
                    });
                });

                it('Wrong Input', function(done){
                    this.timeout(0);
                    const publicUserRegister = {
                        query: `mutation {
                                publicUserRegister(input: {
                                        fields: {
                                        email: ""
                                        },
                                        credential: {
                                        password:"test1234"
                                        }
                                }) 
                                {
                                    _id,
                                    email
                                }
                            }`
                    };
                    methods.query(publicUserRegister)
                    .end((err, res) => {
                        assert.equal(res.body.errors[0].message, "User validation failed: email: Path `email` is required.");
                        assert.equal(res.body.errors[0].statusCode, 400);
                        done();
                    });
                });
            });

            describe('meUpdate', () => {
                it('empty email', function(done){
                    this.timeout(0);
                    const meUpdate = {
                        query: `mutation {
                                meUpdate(input: {
                                        fields: {
                                        email: ""
                                        },
                                }) 
                                {
                                    _id,
                                    email
                                }
                            }`
                    };
                    methods.query(meUpdate)
                    .end((err, res) => {
                        assert.equal(res.body.errors[0].message, "You need to send email.");
                        assert.equal(res.body.errors[0].statusCode, 401);
                        done();
                    });
                });

                it('User Does Not Exist', function(done){
                    this.timeout(0);
                    const meUpdate = {
                        query: `mutation {
                                meUpdate(input: {
                                        fields: {
                                        email: "test123456@gmail.com"
                                        },
                                }) 
                                {
                                    _id,
                                    email
                                }
                            }`
                    };
                    methods.query(meUpdate)
                    .end((err, res) => {
                        assert.equal(res.body.errors[0].message, "The user does not exist.");
                        assert.equal(res.body.errors[0].statusCode, 401);
                        done();
                    });
                });

                it('Schema Validation Failed Boolean and String', function(done){
                    this.timeout(0);
                    const meUpdate = {
                        query: `mutation {
                                meUpdate(input: {
                                        fields: {
                                        email: "test1234@gmail.com",
                                        acceptTnc: "123"
                                        },
                                }) 
                                {
                                    _id,
                                    email
                                }
                            }`
                    };
                    methods.query(meUpdate)
                    .end((err, res) => {
                        assert.equal(res.body.errors[0].message, "Boolean cannot represent a non boolean value: \"123\"");
                        assert.equal(res.body.errors[0].statusCode, 400);
                        done();
                    });
                });

                it('Schema Validation Failed MediaInput and String', function(done){
                    this.timeout(0);
                    const meUpdate = {
                        query: `mutation {
                                meUpdate(input: {
                                        fields: {
                                        email: "test1234@gmail.com",
                                        introductionVideoBase64: "123"
                                        },
                                }) 
                                {
                                    _id,
                                    email
                                }
                            }`
                    };
                    methods.query(meUpdate)
                    .end((err, res) => {
                        assert.equal(res.body.errors[0].message, "Expected value of type \"MediaInput\", found \"123\".");
                        assert.equal(res.body.errors[0].statusCode, 400);
                        done();
                    });
                });

                it('Non Enum Employement Type Value', function(done){
                    this.timeout(0);
                    const meUpdate = {
                        query: `mutation {
                                meUpdate(input: {
                                        fields: {
                                        email: "test1234@gmail.com",
                                        interestedEmploymentType: "123"
                                        },
                                }) 
                                {
                                    _id,
                                    email
                                }
                            }`
                    };
                    methods.query(meUpdate)
                    .end((err, res) => {
                        assert.equal(res.body.errors[0].message, "Enum \"EmploymentType\" cannot represent non-enum value: \"123\".");
                        assert.equal(res.body.errors[0].statusCode, 400);
                        done();
                    });
                });

                it('Non Enum Industry Type Value', function(done){
                    this.timeout(0);
                    const meUpdate = {
                        query: `mutation {
                                meUpdate(input: {
                                        fields: {
                                        email: "test1234@gmail.com",
                                        interestedIndustry: "123"
                                        },
                                }) 
                                {
                                    _id,
                                    email
                                }
                            }`
                    };
                    methods.query(meUpdate)
                    .end((err, res) => {
                        assert.equal(res.body.errors[0].message, "Enum \"Industry\" cannot represent non-enum value: \"123\".");
                        assert.equal(res.body.errors[0].statusCode, 400);
                        done();
                    });
                });

                it('Non Enum School Type Value', function(done){
                    this.timeout(0);
                    const meUpdate = {
                        query: `mutation {
                                meUpdate(input: {
                                        fields: {
                                        email: "test1234@gmail.com",
                                        school: "123"
                                        },
                                }) 
                                {
                                    _id,
                                    email
                                }
                            }`
                    };
                    methods.query(meUpdate)
                    .end((err, res) => {
                        assert.equal(res.body.errors[0].message, "Enum \"School\" cannot represent non-enum value: \"123\".");
                        assert.equal(res.body.errors[0].statusCode, 400);
                        done();
                    });
                });

                it('Non Enum Degree Type Value', function(done){
                    this.timeout(0);
                    const meUpdate = {
                        query: `mutation {
                                meUpdate(input: {
                                        fields: {
                                        email: "test1234@gmail.com",
                                        degree: "123"
                                        },
                                }) 
                                {
                                    _id,
                                    email
                                }
                            }`
                    };
                    methods.query(meUpdate)
                    .end((err, res) => {
                        assert.equal(res.body.errors[0].message, "Enum \"Degree\" cannot represent non-enum value: \"123\".");
                        assert.equal(res.body.errors[0].statusCode, 400);
                        done();
                    });
                });

                it('Non Enum Language Type Value', function(done){
                    this.timeout(0);
                    const meUpdate = {
                        query: `mutation {
                                meUpdate(input: {
                                        fields: {
                                        email: "test1234@gmail.com",
                                        language: "123"
                                        },
                                }) 
                                {
                                    _id,
                                    email
                                }
                            }`
                    };
                    methods.query(meUpdate)
                    .end((err, res) => {
                        assert.equal(res.body.errors[0].message, "Enum \"Language\" cannot represent non-enum value: \"123\".");
                        assert.equal(res.body.errors[0].statusCode, 400);
                        done();
                    });
                });

                it('Success Media Type', function(done){
                    this.timeout(0);
                    const meUpdate = {
                        query: `mutation {
                                meUpdate(input: {
                                        fields: {
                                        email: "test1234@gmail.com",
                                        skillMedia : {
                                            inputBase64: "inputBase64",
                                            title: "title",
                                            description: "description"
                                          }
                                        },
                                }) 
                                {
                                    _id,
                                    email,
                                    skillMedia {
                                      _id,
                                      url
                                    }
                                }
                            }`
                    };
                    methods.query(meUpdate)
                    .end((err, res) => {
                        assert.equal(res.body.data.meUpdate.skillMedia.url, "inputBase64");
                        done();
                    });
                });

                it('Success Language Type', function(done){
                    this.timeout(0);
                    const meUpdate = {
                        query: `mutation {
                                meUpdate(input: {
                                        fields: {
                                        email: "test1234@gmail.com",
                                        language: en
                                        },
                                }) 
                                {
                                    _id,
                                    email,
                                    language
                                }
                            }`
                    };
                    methods.query(meUpdate)
                    .end((err, res) => {
                        assert.equal(res.body.data.meUpdate.language, "en");
                        done();
                    });
                });

                it('Success Industry Type', function(done){
                    this.timeout(0);
                    const meUpdate = {
                        query: `mutation {
                                meUpdate(input: {
                                        fields: {
                                        email: "test1234@gmail.com",
                                        industry: designArt
                                        },
                                }) 
                                {
                                    _id,
                                    email,
                                    industry
                                }
                            }`
                    };
                    methods.query(meUpdate)
                    .end((err, res) => {
                        assert.equal(res.body.data.meUpdate.industry, "designArt");
                        done();
                    });
                });

                it('Success Employement Type', function(done){
                    this.timeout(0);
                    const meUpdate = {
                        query: `mutation {
                                meUpdate(input: {
                                        fields: {
                                        email: "test1234@gmail.com",
                                        interestedEmploymentType: fullTime
                                        },
                                }) 
                                {
                                    _id,
                                    email,
                                    interestedEmploymentType
                                }
                            }`
                    };
                    methods.query(meUpdate)
                    .end((err, res) => {
                        assert.equal(res.body.data.meUpdate.interestedEmploymentType, "fullTime");
                        done();
                    });
                });

                it('Success School Type', function(done){
                    this.timeout(0);
                    const meUpdate = {
                        query: `mutation {
                                meUpdate(input: {
                                        fields: {
                                        email: "test1234@gmail.com",
                                        school: hku
                                        },
                                }) 
                                {
                                    _id,
                                    email,
                                    school
                                }
                            }`
                    };
                    methods.query(meUpdate)
                    .end((err, res) => {
                        assert.equal(res.body.data.meUpdate.school, "hku");
                        done();
                    });
                });

                it('Success Degree Type', function(done){
                    this.timeout(0);
                    const meUpdate = {
                        query: `mutation {
                                meUpdate(input: {
                                        fields: {
                                        email: "test1234@gmail.com",
                                        degree: bba
                                        },
                                }) 
                                {
                                    _id,
                                    email,
                                    degree
                                }
                            }`
                    };
                    methods.query(meUpdate)
                    .end((err, res) => {
                        assert.equal(res.body.data.meUpdate.degree, "bba");
                        done();
                    });
                });
            });
        });
    }
};
