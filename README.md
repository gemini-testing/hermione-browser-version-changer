# hermione-browser-version-changer

[![NPM version](https://img.shields.io/npm/v/hermione-browser-version-changer.svg?style=flat)](https://www.npmjs.org/package/hermione-browser-version-changer)
[![Build Status](https://travis-ci.org/gemini-testing/hermione-browser-version-changer.svg?branch=master)](https://travis-ci.org/gemini-testing/hermione-browser-version-changer)

Plugin for [hermione](https://github.com/gemini-testing/hermione) to manage browser version for each test.

You can read more about hermione plugins [here](https://github.com/gemini-testing/hermione#plugins).

## Installation

```bash
npm install hermione-browser-version-changer
```

## Usage

Plugin has following configuration:

* **enabled** (optional) `Boolean` – enable/disable the plugin, by default plugin is enabled;
* **initStore** (optional) `Function` - allows you to init the store that will be available in a **predicate**;
* **browsers** (required) `Object` - a list of browsers;
* **browsers.\<browserId\>** (required) `Object` - dictionary with browser versions;
* **browsers.\<browserId\>.\<version\>** (required) `Function` - **predicate** to determine a version;

**predicate(test, version, store** it's a function that recieve the `Test` instance, browser version, store and has to return `true` if a test fits to
 the current browser version and `false` if not.

Also there is ability to override plugin parameters by CLI options or environment variables
(see [configparser](https://github.com/gemini-testing/configparser)).

Use `hermione_browser_version_changer_` prefix for the environment variables and `--browser-version-changer-` for the cli options.

Add plugin to your `hermione` config file:

```js
module.exports = {
    // ...
    system: {
        plugins: {
            'hermione-browser-version-changer': {
                enabled: true,
                initStore: async () => {
                    // do some sync or async operation
                    return {
                        '70.1': ['title1', 'title2'],
                        '70.2': ['title3', 'title4'],
                    };
                }
                browsers: {
                    chrome: {
                        '70.1': (test, ver, store) => store[ver].includes(test.title),
                        '70.2': (test, ver, store) => store[ver].includes(test.title),
                    },
                }
            }
        }
    },
    //...
}
```

## Testing

Run [mocha](http://mochajs.org) tests:
```bash
npm run test-unit
```

Run [eslint](http://eslint.org) codestyle verification
```bash
npm run lint
```
