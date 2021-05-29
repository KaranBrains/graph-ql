// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     type: [String],   
// });

// const tokenSchema = new mongoose.Schema({
//     userId: mongoose.ObjectId
// });

// const User = mongoose.model('User', userSchema);
// const Token = mongoose.model('Token', tokenSchema);

// const checkPermission = (req, checkFunc) => {
//     return new Promise((resolve, reject) => {
//         const token = req.header('x-token');
//         if (!token || token === "")
//             reject(new Error("session-expired"));

//         return Token.findById(token)
//             .then(tokenObject => {
//                 if (tokenObject==null)
//                     reject(new Error("session-expired"));
//                 else {
//                     return User.findById(tokenObject.userId)
//                         .then(user => {
//                             if (!checkFunc(user, token))
//                                 reject(new Error("permission-denied"));
//                             else {
//                                 req.user = user;
//                                 resolve();
//                             }
//                         }).catch(err => {
//                         console.log(err);
//                             reject(new Error("session-expired"));
//                     });
//                 }
//             }).catch(err => {
//                 console.log(err);
//                 reject(new Error("session-expired"));
//             });
//     });
// };

// /**
//  * require login admin user
//  * @param req
//  * @param res
//  * @param next
//  */
// const adminUser = (req) => {
//     return checkPermission(req, (user, token) => {
//         return user.type.includes("admin");
//     });
// };

// /**
//  * require login jobSeeker user
//  * @param req
//  * @param res
//  * @param next
//  */
// const jobSeekerUser = (req) => {
//     return checkPermission(req, (user, token) => {
//         return user.type.includes("jobSeeker");
//     });
// };

// /**
//  * require login employer user
//  * @param req
//  * @param res
//  * @param next
//  */
// const employerUser = (req) => {
//     return checkPermission(req, (user, token) => {
//         return user.type.includes("employer");
//     });
// };

// /**
//  * require login ngo user
//  * @param req
//  * @param res
//  * @param next
//  */
// const ngoUser = (req) => {
//     return checkPermission(req, (user, token) => {
//         return user.type.includes("ngo");
//     });
// };

// /**
//  * require any login user
//  * @param req
//  * @param res
//  * @param next
//  */
// const anyUser = (req) => {
//     return checkPermission(req, (user, token) => {
//         return true;
//     });
// };

// module.exports = {
//     User: User,
//     Token: Token,
//     adminUser: adminUser,
//     jobSeekerUser: jobSeekerUser,
//     employerUser: employerUser,
//     ngoUser: ngoUser,
//     anyUser: anyUser
// };