'use strict';

const plugin = require('../../lib');
const {mkHermione, mkConfigStub, mkTestCollection} = require('../utils');

describe('plugin', () => {
    const sandbox = sinon.createSandbox();

    afterEach(() => sandbox.restore());

    it('should NOT subscribe if it\'s disabled', () => {
        const hermione = mkHermione();

        sandbox.spy(hermione, 'on');
        plugin(hermione, {enabled: false});

        hermione.emit(hermione.events.AFTER_TESTS_READ, mkTestCollection([]));

        assert.notCalled(hermione.on);
    });

    it('should subscribe "worker" as well', () => {
        const hermione = mkHermione({proc: 'worker'});

        sandbox.spy(hermione, 'on');
        plugin(hermione, {});

        hermione.emit(hermione.events.AFTER_TESTS_READ, mkTestCollection([]));

        assert.called(hermione.on);
    });

    it('should set browser versions only if appropriate predicates return true for test', () => {
        const config = mkConfigStub({browsers: ['bro1', 'bro2']});
        const hermione = mkHermione({config});
        const test = {browserId: 'bro1', name: 'for 72.1'};
        const test1 = {browserId: 'bro1', name: 'for 72.2'};
        const test2 = {browserId: 'bro2', name: 'test2'};

        plugin(hermione, {
            browsers: {
                bro1: {
                    '72.1': (test) => test.name === 'for 72.1'
                },
                bro2: {
                    '1.2': (test) => test.name === 'test2'
                }
            }
        });

        hermione.emit(hermione.events.AFTER_TESTS_READ, mkTestCollection([test, test1, test2]));

        assert.include(test, {browserVersion: '72.1'});
        assert.notProperty(test1, 'browserVersion');
        assert.include(test2, {browserVersion: '1.2'});
    });

    it('should NOT set browser version if it has not overwritten from native helper', () => {
        const config = mkConfigStub({browsers: ['bro'], version: '1.0'});
        const hermione = mkHermione({config});
        const test = {browserId: 'bro', browserVersion: '1.1', hasBrowserVersionOverwritten: true};

        plugin(hermione, {
            browsers: {
                bro: {'1.2': () => true}
            }
        });

        hermione.emit(hermione.events.AFTER_TESTS_READ, mkTestCollection([test]));

        assert.equal(test.browserVersion, '1.1');
    });

    it('should pass a version to the predicate', () => {
        const config = mkConfigStub({browsers: ['bro1']});
        const hermione = mkHermione({config});
        const test = {browserId: 'bro1', name: 'some-test-name'};
        const predicateSpy = sinon.spy();

        plugin(hermione, {
            browsers: {
                bro1: {
                    '72.1': predicateSpy
                }
            }
        });

        hermione.emit(hermione.events.AFTER_TESTS_READ, mkTestCollection([test]));

        assert.calledWith(predicateSpy, test, '72.1');
    });

    it('should subscribe on init only for the master process', async () => {
        const hermione = mkHermione({proc: 'master'});

        sandbox.stub(hermione, 'on');

        plugin(hermione, {});

        assert.calledWith(hermione.on, 'INIT');
    });

    it('should NOT subscribe on init for if the process is "worker"', async () => {
        const hermione = mkHermione({proc: 'worker'});

        sandbox.stub(hermione, 'on');

        plugin(hermione, {});

        assert.calledOnce(hermione.on);
        assert.isTrue(hermione.on.firstCall.notCalledWith('INIT'));
    });

    it('should init the store and pass it into the predicate', async () => {
        const config = mkConfigStub({browsers: ['bro1']});
        const hermione = mkHermione({config});
        const test = {browserId: 'bro1', name: 'for 72.1'};
        const predicateSpy = sinon.spy();

        plugin(hermione, {
            initStore: () => Promise.resolve({data: 'some'}),
            browsers: {
                bro1: {
                    '72.1': predicateSpy
                }
            }
        });

        await hermione.emitAsync(hermione.events.INIT);
        hermione.emit(hermione.events.AFTER_TESTS_READ, mkTestCollection([test]));

        assert.calledWith(predicateSpy, sinon.match.any, sinon.match.any, {data: 'some'});
    });
});
