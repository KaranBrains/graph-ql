const { errorType } = require('../src/constants/errors');

const getErrorCode = errorName => {
  return errorType[errorName]
}

module.exports = getErrorCode