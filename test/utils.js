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

    return hermione;
};

exports.mkTestCollection = (tests) => ({
    eachTest: (cb) => tests.forEach(cb)
});
