const test = require('../util/test');
const methods = test.methods;

test.initTest();

// include all the tests here
describe('tests', () => {
    /** include all test classes here */
    require('../src/test').test(methods);
});