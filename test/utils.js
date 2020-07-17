'use strict';

const _ = require('lodash');
const AsyncEmitter = require('gemini-core').events.AsyncEmitter;

exports.mkHermione = (opts = {}) => {
    _.defaults(opts, {
        proc: 'master',
        browsers: {}
    });

    const hermione = new AsyncEmitter();

    hermione.events = {
        AFTER_TESTS_READ: 'AFTER_TESTS_READ',
        INIT: 'INIT'
    };
    hermione.isWorker = () => opts.proc !== 'master';
    hermione.config = opts.config || exports.mkConfigStub();

    return hermione;
};

exports.mkConfigStub = (opts = {}) => {
    opts = _.defaults(opts, {
        browsers: ['some-default-browser'],
        version: '1.0'
    });

    const config = {
        browsers: {}
    };

    opts.browsers.forEach(function(browserId) {
        config.browsers[browserId] = {
            desiredCapabilities: {browserName: browserId, version: opts.version}
        };
    });

    config.forBrowser = (browserId) => config.browsers[browserId];

    return config;
};

exports.mkTestCollection = (tests) => ({
    eachTest: (cb) => tests.forEach(cb)
});
