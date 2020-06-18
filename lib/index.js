'use strict';

const _ = require('lodash');
const parseConfig = require('./config');

module.exports = (hermione, opts) => {
    const config = parseConfig(opts);

    if (!config.enabled) {
        return;
    }

    hermione.on(hermione.events.AFTER_TESTS_READ, collection => {
        collection.eachTest(test => {
            const versions = _.get(config.browsers, test.browserId, {});
            const browserVersion = _.findKey(versions, (predicate) => predicate(test));

            if (!browserVersion) {
                return;
            }

            test.browserVersion = browserVersion;
        });
    });
};
