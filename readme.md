# ng-i18n-tools

Working with Angular translations might be a pain especially with syncing locales & managing the files in general. Each locale might be a huge file with hundreds (or thousands?) of locale strings. This library is trying to help developers and translators to manage the locales with ease with 3 simple tools: [sync](#sync), [split](#split), [merge](#merge).

**This tool currently supports only `json` translations format and there are no plans of supporting other types of files.**

## Compatibility

Fully compatible with Angular starting v11.

## Prerequisites

Use `@@appComponentHelloTitle`-like id keys with all your localization - this will allow you to manage locale keys with ease and use this page to maintain them quickly.

## Installation

```bash
npm install gorenburg/ng-i18n-tools --save-dev
```

## sync

Sync method synchronizes the default locale with other locales you have specified in the `angular.json` file. For example, you wrote the component and added translation keys to it. Now, instead of opening each translation file you just run the Angular command to extract the default locale (`ng extract-i18n --format json`) and then you run `npm run sync` to add new key strings to all the locale files you have. New keys would be added empty at the end of the file.

### Options

Command excution with options example:
```bash
npx ng-i18n-tools-sync --acf './frontend/angular.json' --lp './frontend/src/locales'
```

| Syntax | Alias | Type | Default value | Description |
|-|-|-|-|-|
| angular-config-file | acf | string | `./angular.json` | Angular configuration pathname with filename |
| locales-path | lp | string | `./src/locales` | Default locales path |
| default-fallback | df | boolean | `false` | Fallback to default locale key's value if a key is missing in the translation file. If `true` - missing key's value would be filled with default locale key's value |

## split

If managing a large file with lots of translations key is a big pain - you can split one large file into small pieces (just like splitting a huge module into small components) and manage locales from there. You would need to use ids for your locales and follow `camelCase` key-naming for this method to work. Example:

```json
  {
    "appComponentHelloTitle": "Title",
    "appComponentHelloDescription": "Description",
    "appComponentWorldTitle": "Title",
    "appComponentWorldDescription": "Description"
  }
```

This block would be parsed into:

```javascript
  {
    'app.component.hello': {
      title: 'Title',
      description: 'Description'
    },
    'app.component.world': {
      title: 'Title',
      description: 'Description'
    }
  }
```

And then would be saved as 2 files as following (with `dotCase` option): `/${LOCALE}/app.component.hello.messages.${LOCALE}.json` and `/${LOCALE}/app.component.world.messages.${LOCALE}.json`

After splitting the locales you would need `merge` tool to compile all the files back to a single file for Angular

### Options

Command excution with options example:
```bash
npx ng-i18n-tools-split --acf './frontend/angular.json' --lp './frontend/src/locales'
```

| Syntax | Alias | Type | Default value | Description |
|-|-|-|-|-|
| angular-config-file | acf | string | `./angular.json` | Angular configuration pathname with filename |
| locales-path | lp | string | `./src/locales` | Default locales path |
| file-name-case | fnc | string | `dotCase` | File naming case for saved files. `dotCase` would generate files as `app.component.hello.messages.${LOCALE}.json`, `paramCase` would generate files as `app-component-hello.messages.${LOCALE}.json` |

## merge

*This method is based on original [ng-i18n-merge-files](https://github.com/marcioggs/ng-i18n-merge-files) package by [Márcio Gabriel](https://github.com/marcioggs).*

Merge method takes all your localization files (per locale) and merges them into one file. For example, these files (and others with the same locale):

```
/src/app/locale/fr/app.component.hello.messages.fr.json
/src/app/locale/fr/app.component.world.messages.fr.json
```

Would be merged into one single file: `/src/app/locale/messages.fr.json`

You can also add the filename to each key which will allow you to generate unique id keys by running the script with `--i true` param. Example:

Keys saved in `app.component.hello.messages.${LOCALE}.json`

```json
  {
    "Title": "Title 1",
    "Description": "Description 1"
  }
```

and keys saved in `app.component.world.messages.${LOCALE}.json` as 

```json
  {
    "Title": "Title 2",
    "Description": "Description 2"
  }
```

would all be merged in `messages.${LOCALE}.json` into

```json
{
  "locale": "LOCALE",
  "translations": {
    "Title": "Title 2",
    "Description": "Description 2"
  }
}
```

If you turn on `id-prefix` to `true`, then the same locale keys would be merged into:

```json
{
  "locale": "LOCALE",
  "translations": {
    "appComponentHelloTitle": "Message 1",
    "appComponentHelloSubtitle": "Message 2",
    "appComponentWorldTitle": "Message 3",
    "appComponentWorldSubtitle": "Message 4",
    ...
  }
}
```

### Options

Command excution with options example:
```bash
npx ng-i18n-tools-merge --in './frontend/src/locales' --out './frontend/src/locales'
```

| Syntax | Alias | Type | Default value | Description |
|-|-|-|-|-|
| in | i | string | `./src/locales` | Folder which will be searched recursively for translation files to be merged. |
| out | o | string | `./src/locales` | Folder where the merged translation files will be saved to. |
| id-prefix | i | boolean | `false` | Adds a prefix to the translation identifier based on the translation filename (see --id-prefix-strategy) |
| id-prefix-strategy | s | string | `camelCase` | Naming strategy applied to the translation filename to generate the identifier prefix. `camelCase` would merge filename into `appComponentHelloTitle` key-like; `as-is` would merge in `paramCase`, just like `app-component-hello-title`; `dotCase` would merge as `app.component.hello.title` |
