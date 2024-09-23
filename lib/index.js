'use strict';

const _ = require('lodash');
const parseConfig = require('./config');

module.exports = (testplane, opts) => {
    const config = parseConfig(opts);

    if (!config.enabled) {
        return;
    }

    if (!testplane.isWorker()) {
        testplane.on(testplane.events.INIT, async () => {
            opts.store = await Promise.resolve(config.initStore());
        });
    }

    testplane.on(testplane.events.AFTER_TESTS_READ, collection => {
        collection.eachTest(test => {
            const {browserId} = test;
            const versions = _.get(config.browsers, browserId, {});
            const pluginBrowserVersion = _.findKey(versions, (predicate, ver) => predicate(test, ver, opts.store));

            if (!pluginBrowserVersion) {
                return;
            }

            if (test.hasBrowserVersionOverwritten) {
                return;
            }

            test.browserVersion = pluginBrowserVersion;
        });
    });
};
