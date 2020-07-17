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
            const browserConfig = hermione.config.forBrowser(browserId);
            const configVersion = browserConfig.desiredCapabilities.version;
            const versions = _.get(config.browsers, browserId, {});
            const pluginBrowserVersion = _.findKey(versions, (predicate, ver) => predicate(test, ver, opts.store));

            if (!pluginBrowserVersion) {
                return;
            }

            // Переопределяем версию, только если она была проставлена через хелпер browser().version()
            // и не соответствует дефолтной версии из конфига
            if (test.browserVersion && test.browserVersion !== configVersion) {
                return;
            }

            test.browserVersion = pluginBrowserVersion;
        });
    });
};
