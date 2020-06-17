'use strict';

const _ = require('lodash');
const configParser = require('gemini-configparser');

const {root, map, section, option} = configParser;

const ENV_PREFIX = 'hermione_browser_version_changer_';
const CLI_PREFIX = '--browser-version-changer-';

const getParser = () => {
    return root(section({
        enabled: option({
            defaultValue: true,
            parseEnv: JSON.parse,
            parseCli: JSON.parse,
            validate: (val) => {
                if (!_.isBoolean(val)) {
                    throw new TypeError(`value of "enabled" must be "boolean" rather than "${typeof val}"`);
                }
            }
        }),
        browsers: map(map(option({
            validate: (val) => {
                if (!_.isFunction(val)) {
                    throw new TypeError(`predicate must be a "function" rather than "${typeof val}"`);
                }
            }
        })))
    }), {envPrefix: ENV_PREFIX, cliPrefix: CLI_PREFIX});
};

module.exports = (options) => {
    const {env, argv} = process;

    return getParser()({options, env, argv});
};
