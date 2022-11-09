# hermione-browser-version-changer

## Обзор

Используйте плагин `hermione-browser-version-changer`, чтобы управлять определением версии браузера для тестов.

## Установка

```bash
npm install -D hermione-browser-version-changer
```

## Настройка

Необходимо подключить плагин в разделе `plugins` конфига `hermione`:

```javascript
module.exports = {
    plugins: {
        'hermione-browser-version-changer': {
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

        // другие плагины гермионы...
    },

    // другие настройки гермионы...
};
```

### Расшифровка параметров конфигурации

| **Параметр** | **Тип** | **По&nbsp;умолчанию** | **Описание** |
| ------------ | ------- | --------------------- | ------------ |
| [enabled](#enabled) | Boolean | true | Включить / отключить плагин. |
| [initStore](#initstore) | Function | _[noop][noop]_ | Функция для инициализации хранилища _(store)_, которое будет доступно в [predicate](#predicatetest-version-store). |
| [browsers](#browsers) | Object | _N/A_ | Список браузеров и их настроек. См. [ниже](#browsers) подробности. |

### enabled

Включить или отключить плагин. По умолчанию: `true`.

### initStore

Необязательный параметр. Функция для инициализации хранилища _(store)_, которое будет доступно в [predicate](#predicatetest-version-store). Хранилище может использоваться для того, чтобы потом в [predicate](#predicatetest-version-store) для любого теста определить, какая версия браузера к нему относится. По умолчанию: [_.noop][noop] из библиотеки [lodash][lodash].

Функция может быть асинхронной.

### browsers

Список браузеров и их настроек. Имеет следующий формат:

```javascript
browsers: {
    <browser-id>: {
        <browser-version-1>: <predicate>,
        <browser-version-2>: <predicate>,
        // другие версии браузеров...
    },
    // другие браузеры...
}
```

### predicate(test, version, store)

Функция-предикат, которая получает инстанс теста _(test),_ версию браузера _(version)_ и ссылку на хранилище _(store)_. Должна вернуть `true`, если тест подходит под указанную версию браузера, иначе должна вернуть `false`.

### Передача параметров через CLI

Все параметры плагина, которые можно определить в конфиге, можно также передать в виде опций командной строки или через переменные окружения во время запуска гермионы. Используйте префикс `--browser-version-changer-` для опций командной строки и `hermione_browser_version_changer_` &mdash; для переменных окружения. Например:

```bash
npx hermione --browser-version-changer-enabled false
```

```bash
hermione_browser_version_changer_enabled=false npx hermione
```

[noop]: https://lodash.com/docs/4.17.15#noop
[lodash]: https://lodash.com/
