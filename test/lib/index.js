'use strict';

const plugin = require('../../lib');
const {mkTestplane, mkConfigStub, mkTestCollection} = require('../utils');

describe('plugin', () => {
    const sandbox = sinon.createSandbox();

    afterEach(() => sandbox.restore());

    it('should NOT subscribe if it\'s disabled', () => {
        const testplane = mkTestplane();

        sandbox.spy(testplane, 'on');
        plugin(testplane, {enabled: false});

        testplane.emit(testplane.events.AFTER_TESTS_READ, mkTestCollection([]));

        assert.notCalled(testplane.on);
    });

    it('should subscribe "worker" as well', () => {
        const testplane = mkTestplane({proc: 'worker'});

        sandbox.spy(testplane, 'on');
        plugin(testplane, {});

        testplane.emit(testplane.events.AFTER_TESTS_READ, mkTestCollection([]));

        assert.called(testplane.on);
    });

    it('should set browser versions only if appropriate predicates return true for test', () => {
        const config = mkConfigStub({browsers: ['bro1', 'bro2']});
        const testplane = mkTestplane({config});
        const test = {browserId: 'bro1', name: 'for 72.1'};
        const test1 = {browserId: 'bro1', name: 'for 72.2'};
        const test2 = {browserId: 'bro2', name: 'test2'};

        plugin(testplane, {
            browsers: {
                bro1: {
                    '72.1': (test) => test.name === 'for 72.1'
                },
                bro2: {
                    '1.2': (test) => test.name === 'test2'
                }
            }
        });

        testplane.emit(testplane.events.AFTER_TESTS_READ, mkTestCollection([test, test1, test2]));

        assert.include(test, {browserVersion: '72.1'});
        assert.notProperty(test1, 'browserVersion');
        assert.include(test2, {browserVersion: '1.2'});
    });

    it('should NOT set browser version if it has not overwritten from native helper', () => {
        const config = mkConfigStub({browsers: ['bro'], version: '1.0'});
        const testplane = mkTestplane({config});
        const test = {browserId: 'bro', browserVersion: '1.1', hasBrowserVersionOverwritten: true};

        plugin(testplane, {
            browsers: {
                bro: {'1.2': () => true}
            }
        });

        testplane.emit(testplane.events.AFTER_TESTS_READ, mkTestCollection([test]));

        assert.equal(test.browserVersion, '1.1');
    });

    it('should pass a version to the predicate', () => {
        const config = mkConfigStub({browsers: ['bro1']});
        const testplane = mkTestplane({config});
        const test = {browserId: 'bro1', name: 'some-test-name'};
        const predicateSpy = sinon.spy();

        plugin(testplane, {
            browsers: {
                bro1: {
                    '72.1': predicateSpy
                }
            }
        });

        testplane.emit(testplane.events.AFTER_TESTS_READ, mkTestCollection([test]));

        assert.calledWith(predicateSpy, test, '72.1');
    });

    it('should subscribe on init only for the master process', async () => {
        const testplane = mkTestplane({proc: 'master'});

        sandbox.stub(testplane, 'on');

        plugin(testplane, {});

        assert.calledWith(testplane.on, 'INIT');
    });

    it('should NOT subscribe on init for if the process is "worker"', async () => {
        const testplane = mkTestplane({proc: 'worker'});

        sandbox.stub(testplane, 'on');

        plugin(testplane, {});

        assert.calledOnce(testplane.on);
        assert.isTrue(testplane.on.firstCall.notCalledWith('INIT'));
    });

    it('should init the store and pass it into the predicate', async () => {
        const config = mkConfigStub({browsers: ['bro1']});
        const testplane = mkTestplane({config});
        const test = {browserId: 'bro1', name: 'for 72.1'};
        const predicateSpy = sinon.spy();

        plugin(testplane, {
            initStore: () => Promise.resolve({data: 'some'}),
            browsers: {
                bro1: {
                    '72.1': predicateSpy
                }
            }
        });

        await testplane.emitAsync(testplane.events.INIT);
        testplane.emit(testplane.events.AFTER_TESTS_READ, mkTestCollection([test]));

        assert.calledWith(predicateSpy, sinon.match.any, sinon.match.any, {data: 'some'});
    });
});
