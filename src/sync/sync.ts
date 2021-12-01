import fs from 'fs'
import getAngularConfigLanguages from '../helpers/get_angular_config_languages'
import getParsedFileData from '../helpers/get_parsed_file'

import { ILocaleConfigs } from '../types/main'
import { ICompiledTranslationFileData, ITranslationSettings } from '../types/sync'

let localesPath: string
let localeConfigs: ILocaleConfigs = {}
const translationSettings: ITranslationSettings = {}

/**
 * Loading angular file, getting default locale keys; going through other locales to missing translation keys and adding them to the end of locale files
 *
 * @param localesAbsolutePath Absolute path to locales folder
 * @param angularConfigFile Absolute path to angular configuration file
 */
function run(localesAbsolutePath: string, angularConfigFile: string, fallbackToDefault = false): void {
  localesPath = localesAbsolutePath
  localeConfigs = getAngularConfigLanguages(angularConfigFile, localesPath)

  if (!Object.keys(localeConfigs).length) {
    return
  }

  const defaultTranslations = getLanguageLocale()

  for (let language in localeConfigs) {
    const languageTranslations = getLanguageLocale(localeConfigs[language], language)
    if (!Object.keys(languageTranslations).length) { return }

    for (let key in defaultTranslations) {
      if (languageTranslations[key]) {
        translationSettings[language].translations[key] = languageTranslations[key]
      } else if (fallbackToDefault) {
        translationSettings[language].translations[key] = defaultTranslations[key]
      } else {
        translationSettings[language].translations[key] = ''
      }
    }

    fs.writeFileSync(translationSettings[language].filepath, JSON.stringify(getCompiledTranslationFileData(language), null, 2), 'utf8')
  }

}

/**
 * Getting locale translations
 *
 * @param filepath Absolute path to locales folder
 * @param languageCode Absolute path to angular configuration file
 * @returns Object pair `key: value` translation
 */
function getLanguageLocale(filepath = `${localesPath}/messages.json`, languageCode = 'en'): { [key: string]: string } {

  translationSettings[languageCode] = {
    isFileExists: true,
    translations: {},
    filepath
  }

  const parsedLocaleFile = getParsedFileData(filepath)

  if (parsedLocaleFile) {
    translationSettings[languageCode].translations = parsedLocaleFile.translations
    return parsedLocaleFile.translations
  }

  translationSettings[languageCode].isFileExists = false
  console.error(`File read error: ${filepath}`)
  return {}
}

/**
 * Getting compiled translations object
 *
 * @param locale Locale value
 * @returns Object pair `key: value` translation with locale key to be saved in the file
 */
function getCompiledTranslationFileData(locale: string): ICompiledTranslationFileData {
  const translation = {
    locale,
    translations: translationSettings[locale].translations
  }
  return translation
}

module.exports = { run }
