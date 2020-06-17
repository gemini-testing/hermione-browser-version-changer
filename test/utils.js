'use strict';

const _ = require('lodash');
const {EventEmitter} = require('events');

exports.mkHermione = (opts = {}) => {
    _.defaults(opts, {
        proc: 'master',
        browsers: {}
    });

    const hermione = new EventEmitter();

    hermione.events = {AFTER_TESTS_READ: 'AFTER_TESTS_READ'};

    return hermione;
};

exports.mkTestCollection = (tests) => ({
    eachTest: (cb) => tests.forEach(cb)
});
