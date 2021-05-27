const Kitten = require('./model');
const Permission = require('../../util/permission');

module.exports = {
    query: {
        /** no permission checking */
        get: ({id}, req) => Kitten.get(id),
        /** require any login user, get logged in user as req.user */
        list: ({}, req) => Permission.anyUser(req).then(() => Kitten.list()),
        /** require any login user, get logged in user as req.user */
        search: ({text}, req) => Permission.anyUser(req).then(() => Kitten.search(text)),
        /** require any login user, get logged in user as req.user */
        getByChipNumber: ({chipNumber}, req) => Permission.anyUser(req).then(() => Kitten.getByChipNumber(chipNumber)),
    },
    mutation: {
        /** require login admin user, get logged in user as req.user */
        create: ({input}, req) => Permission.adminUser(req).then(() => Kitten.create(input, req.user)),
        /** require login admin user, get logged in user as req.user */
        update: ({id, input}, req) => Permission.adminUser(req).then(() => Kitten.update(id, input, req.user)),
        /** require login admin user , get logged in user as req.user*/
        delete: ({id}, req) => Permission.adminUser(req).then(() => Kitten.delete(id, req.user)),
    }
};