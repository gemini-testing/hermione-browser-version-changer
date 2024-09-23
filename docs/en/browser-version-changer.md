# @testplane/browser-version-changer

## Overview

Use the `@testplane/browser-version-changer` plugin to manage the definition of the browser version for tests.

## Install

```bash
npm install -D @testplane/browser-version-changer
```

## Setup

Add the plugin to the `plugins` section of the `testplane` config:

```javascript
module.exports = {
    plugins: {
        '@testplane/browser-version-changer': {
            enabled: true,
            initStore: async () => {
                return {
                    '70.1': ['title1', 'title2'],
                    '70.2': ['title3', 'title4']
                };
            }
            browsers: {
                chrome: {
                    '70.1': (test, ver, store) => store[ver].includes(test.title),
                    '70.2': (test, ver, store) => store[ver].includes(test.title)
                }
            }
        },

        // other testplane plugins...
    },

    // other testplane settings...
};
```

### Description of configuration parameters

| **Parameter** | **Type** | **Default&nbsp;value** | **Description** |
| ------------- | -------- | ---------------------- | --------------- |
| [enabled](#enabled) | Boolean | true | Enable / disable the plugin. |
| [initStore](#initstore) | Function | _[noop][noop]_ | Function for initializing the storage _(store)_, which will be available in [predicate](#predicatetest-version-store). |
| [browsers](#browsers) | Object | _N/A_ | A list of browsers and their settings. See details [below](#browsers). |

### enabled

Enable or disable the plugin. By default: `true`.

### initStore

Optional parameter. Function for initializing the storage _(store)_, which will be available in [predicate](#predicatetest-version-store). The store can be used in [predicate](#predicatetest-version-store) for any test to determine which version of the browser belongs to it. By default: [_.noop][noop] from [lodash][lodash].

The function can be asynchronous.

### browsers

A list of browsers and their settings. It has the following format:

```javascript
browsers: {
    <browser-id>: {
        <browser-version-1>: <predicate>,
        <browser-version-2>: <predicate>,
        // other browser versions...
    },
    // other browsers...
}
```

### predicate(test, version, store)

A predicate function that receives the test instance _(test),_ browser version _(version)_ and a link to the storage _(store)_. It should return `true` if the test fits the specified browser version, otherwise it should return `false`.

### Passing parameters via the CLI

All plugin parameters that can be defined in the config can also be passed as command line options or through environment variables during Testplane startup. Use the prefix `--browser-version-changer-` for command line options and `testplane_browser_version_changer_` for environment variables. For example:

```bash
npx testplane --browser-version-changer-enabled false
```

```bash
testplane_browser_version_changer_enabled=false npx testplane
```

[noop]: https://lodash.com/docs/4.17.15#noop
[lodash]: https://lodash.com/
