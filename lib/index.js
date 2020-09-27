'use strict';

const _ = require('lodash');
const parseConfig = require('./config');

module.exports = (hermione, opts) => {
    const config = parseConfig(opts);

    if (!config.enabled) {
        return;
    }

    if (!hermione.isWorker()) {
        hermione.on(hermione.events.INIT, async () => {
            opts.store = await Promise.resolve(config.initStore());
        });
    }

    hermione.on(hermione.events.AFTER_TESTS_READ, collection => {
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
