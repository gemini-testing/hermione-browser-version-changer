'use strict';

const parseConfig = require('../../lib/config');

describe('config', () => {
    describe('enabled', () => {
        it('should throw if it\'s not "boolean"', () => {
            assert.throw(() => parseConfig({enabled: 10}));
        });

        it('should NOT throw if it\'s is "boolean"', () => {
            assert.doesNotThrow(() => parseConfig({enabled: true}));
        });
    });

    describe('initStore', () => {
        it('should throw if it\'s not "function"', () => {
            assert.throw(() => parseConfig({initStore: {data: 'some'}}));
        });

        it('should NOT throw if it\'s "function"', () => {
            assert.doesNotThrow(() => parseConfig({initStore: () => {}}));
        });
    });

    describe('browsers.<id>.<version>', () => {
        it('should throw if it\'s not "function"', () => {
            assert.throw(() => parseConfig({
                browsers: {
                    chrome: {
                        '10.1': false
                    }
                }
            }));
        });

        it('should NOT throw if it\'s "function"', () => {
            assert.doesNotThrow(() => parseConfig({
                browsers: {
                    chrome: {
                        '10.1': () => {}
                    }
                }
            }));
        });
    });
});
