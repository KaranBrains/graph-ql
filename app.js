/**
 *
 * Runner class, you may add your custom debug middleware here.
 *
 * Note that this will not be used in the final project output, if you need to add any custom middleware for production, please let us know.
 *
 */

/** connect mongodb */
require('./util/mongo').connect(() => {
    require('@talkbox/backend-util-logger').info("mongo", "connected");
});

/** get express instance */
const backendExpress = require('@talkbox/backend-util-express');
const app = require('./util/app');

/** add your custom debug middleware here */

/** start express server */
backendExpress.start(app);
