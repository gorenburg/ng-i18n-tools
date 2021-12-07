"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const get_angular_config_languages_1 = __importDefault(require("../helpers/get_angular_config_languages"));
const get_parsed_file_1 = __importDefault(require("../helpers/get_parsed_file"));
let localesPath;
let localeConfigs = {};
const translationSettings = {};
/**
 * Loading angular file, getting default locale keys; going through other locales to missing translation keys and adding them to the end of locale files
 *
 * @param localesAbsolutePath Absolute path to locales folder
 * @param angularConfigFile Absolute path to angular configuration file
 */
function run(localesAbsolutePath, angularConfigFile, fallbackToDefault = false) {
    localesPath = localesAbsolutePath;
    localeConfigs = (0, get_angular_config_languages_1.default)(angularConfigFile, localesPath);
    if (!Object.keys(localeConfigs).length) {
        return;
    }
    const defaultTranslations = getLanguageLocale();
    for (let language in localeConfigs) {
        const languageTranslations = getLanguageLocale(localeConfigs[language], language);
        for (let key in defaultTranslations) {
            if (languageTranslations[key]) {
                translationSettings[language].translations[key] = languageTranslations[key];
            }
            else if (fallbackToDefault) {
                translationSettings[language].translations[key] = defaultTranslations[key];
            }
            else {
                translationSettings[language].translations[key] = '';
            }
        }
        fs_1.default.writeFileSync(translationSettings[language].filepath, JSON.stringify(getCompiledTranslationFileData(language), null, 2), 'utf8');
    }
}
/**
 * Getting locale translations
 *
 * @param filepath Absolute path to locales folder
 * @param languageCode Absolute path to angular configuration file
 * @returns Object pair `key: value` translation
 */
function getLanguageLocale(filepath = `${localesPath}/messages.json`, languageCode = 'en') {
    translationSettings[languageCode] = {
        isFileExists: true,
        translations: {},
        filepath
    };
    const parsedLocaleFile = (0, get_parsed_file_1.default)(filepath);
    if (parsedLocaleFile) {
        translationSettings[languageCode].translations = parsedLocaleFile.translations;
        return parsedLocaleFile.translations;
    }
    translationSettings[languageCode].isFileExists = false;
    console.error(`File read error: ${filepath}`);
    return {};
}
/**
 * Getting compiled translations object
 *
 * @param locale Locale value
 * @returns Object pair `key: value` translation with locale key to be saved in the file
 */
function getCompiledTranslationFileData(locale) {
    const translation = {
        locale,
        translations: translationSettings[locale].translations
    };
    return translation;
}
module.exports = { run };
