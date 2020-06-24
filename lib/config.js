'use strict';

const _ = require('lodash');
const configParser = require('gemini-configparser');

const {root, map, section, option} = configParser;

const ENV_PREFIX = 'hermione_browser_version_changer_';
const CLI_PREFIX = '--browser-version-changer-';

const thr = (str) => {
    throw new TypeError(str);
};
const assertType = (name, validationFn, type) => (v) =>
    !validationFn(v) && thr(`"${name}" option must be ${type}, but got ${typeof v}`);
const assertBoolean = (name) => assertType(name, _.isBoolean, 'boolean');
const assertFunction = (name) => assertType(name, _.isFunction, 'function');

const getParser = () => {
    return root(section({
        enabled: option({
            defaultValue: true,
            parseEnv: JSON.parse,
            parseCli: JSON.parse,
            validate: assertBoolean('enabled')
        }),
        initStore: option({
            defaultValue: () => _.noop,
            validate: assertFunction('initStore')
        }),
        browsers: map(map(option({
            validate: assertFunction('browsers.<id>.<version>')
        })))
    }), {envPrefix: ENV_PREFIX, cliPrefix: CLI_PREFIX});
};

module.exports = (options) => {
    const {env, argv} = process;

    return getParser()({options, env, argv});
};
