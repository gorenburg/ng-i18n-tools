"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const change_case_1 = require("change-case");
const get_angular_config_languages_1 = __importDefault(require("../helpers/get_angular_config_languages"));
let localeConfigs = {};
let localesPath;
/**
 * Loading angular file, getting locale files and running split function
 *
 * @param localesAbsolutePath Absolute path to locales folder
 * @param angularConfigFile Absolute path to angular configuration file
 * @param filenameCase Filename case to use. `dotCase` (for `app.component.hello.messages.${LOCALE}.json`) or `paramCase` (for `app-component-hello.messages.${LOCALE}.json`)
 */
function run(localesAbsolutePath, angularConfigFile, filenameCase) {
    localesPath = localesAbsolutePath;
    localeConfigs = get_angular_config_languages_1.default(angularConfigFile, localesPath);
    if (!Object.keys(localeConfigs).length) {
        return;
    }
    splitLocales(filenameCase);
}
/**
 * Splits translation file into separate files for easier management of translation files
 *
 * @param filenameCase Filename case to use. `dotCase` (for `app.component.hello.messages.${LOCALE}.json`) or `paramCase` (for `app-component-hello.messages.${LOCALE}.json`)
 */
function splitLocales(filenameCase) {
    for (let localeKey in localeConfigs) {
        const localeFile = fs_1.default.readFileSync(localeConfigs[localeKey], 'utf8');
        const parsedDefaultLocale = JSON.parse(localeFile);
        const keysList = {};
        /**
        * Parsing translation keys into object. Example (with 'dotCase' param in 'file-name-case'):
        * {
        *   "appComponentHelloTitle": "Title",
        *   "appComponentHelloDescription": "Description",
        *   "appComponentWorldTitle": "Title",
        *   "appComponentWorldDescription": "Description"
        * }
        * Would be parsed into:
        * {
        *   'app.component.hello': {
        *     title: 'Title',
        *     description: 'Description'
        *   },
        *   'app.component.world': {
        *     title: 'Title',
        *     description: 'Description'
        *   }
        * }
        */
        for (let key in parsedDefaultLocale.translations) {
            const parsedKeyArray = change_case_1.noCase(key).split(' ');
            if ((parsedKeyArray.length - 1) > 0) {
                let shortenKeyArray = [...parsedKeyArray];
                let shortenedKey;
                if (filenameCase === 'paramCase') {
                    shortenedKey = shortenKeyArray.slice(0, parsedKeyArray.length - 1).join('-');
                }
                else {
                    shortenedKey = shortenKeyArray.slice(0, parsedKeyArray.length - 1).join('.');
                }
                if (!keysList[shortenedKey]) {
                    keysList[shortenedKey] = {};
                }
                keysList[shortenedKey][parsedKeyArray[parsedKeyArray.length - 1]] = parsedDefaultLocale.translations[key];
            }
        }
        /**
        * Splitting each key as a separate file. Example:
        * {
        *   'app.component.hello': {
        *     title: 'Title',
        *     description: 'Description'
        *   },
        *   'app.component.world': {
        *     title: 'Title',
        *     description: 'Description'
        *   }
        * }
        * Would be parsed and saved as:
        * /${LOCALE}/app.component.hello.messages.${LOCALE}.json
        * {
        *   translations: {
        *     title: 'Title',
        *     description: 'Description'
        *   }
        * }
        * /${LOCALE}/app.component.world.messages.${LOCALE}.json
        * {
        *   translations: {
        *     title: 'Title',
        *     description: 'Description'
        *   }
        * }
        */
        for (let key in keysList) {
            const translations = {
                ...keysList[key]
            };
            const localeKeyPath = `${localesPath}/${localeKey}`;
            const filename = `${localeKeyPath}/${key}.messages.${localeKey}.json`;
            if (!fs_1.default.existsSync(localeKeyPath)) {
                fs_1.default.mkdirSync(localeKeyPath);
            }
            fs_1.default.writeFileSync(filename, JSON.stringify(translations, null, 2), 'utf8');
        }
    }
}
module.exports = { run };
