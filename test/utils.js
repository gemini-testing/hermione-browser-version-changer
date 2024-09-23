'use strict';

const _ = require('lodash');
const EventEmitter2 = require('eventemitter2');

exports.mkTestplane = (opts = {}) => {
    _.defaults(opts, {
        proc: 'master',
        browsers: {}
    });

    const testplane = new EventEmitter2();

    testplane.events = {
        AFTER_TESTS_READ: 'AFTER_TESTS_READ',
        INIT: 'INIT'
    };
    testplane.isWorker = () => opts.proc !== 'master';
    testplane.config = opts.config || exports.mkConfigStub();

    return testplane;
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
