exports.errorName = {
    ALREADY_EXISTS: 'ALREADY_EXISTS',
    DOESNT_EXISTS: 'DOESNT_EXISTS',
    EMAIL_MISSING: 'EMAIL_MISSING',
    WRONG_INPUT: 'WRONG_INPUT'
}
  
exports.errorType = {
    ALREADY_EXISTS: {
        message: 'The user already exists.',
        statusCode: 401
    },
    WRONG_INPUT: {
        message: 'You need to send all entries.',
        statusCode: 401
    },
    DOESNT_EXISTS: {
        message: 'The user does not exist.',
        statusCode: 401
    },
    EMAIL_MISSING: {
        message: 'You need to send email.',
        statusCode: 401
    }
}
