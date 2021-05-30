const kitten = require('./src/kittens/functions');
const User = require('./src/Users/functions');

module.exports = {
    /** bind your query and mutation functions here */
    /** sample object kitten */
    kittenGet: kitten.query.get,
    kittenList: kitten.query.list,
    kittenSearch: kitten.query.search,
    kittenGetByChipNumber: kitten.query.getByChipNumber,
    kittenCreate: kitten.mutation.create,
    kittenUpdate: kitten.mutation.update,
    kittenDelete: kitten.mutation.delete,
    emailVerificationRequest: User.mutation.verificationRequest,
    emailVerificationVerify : User.mutation.emailVerificationVerify,
    publicUserRegister : User.mutation.publicUserRegister,
    meUpdate: User.mutation.meUpdate,
};