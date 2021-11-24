import fs from 'fs'
import { noCase } from 'change-case'
import getAngularConfigLanguages from '../helpers/get_angular_config_languages'

import { ILocaleConfigs } from '../types/main'
import { IKeysList, FilenameCase } from '../types/split'

let localeConfigs: ILocaleConfigs = {}
let localesPath: string

/**
 * Loading angular file, getting locale files and running split function
 *
 * @param localesAbsolutePath Absolute path to locales folder
 * @param angularConfigFile Absolute path to angular configuration file
 * @param filenameCase Filename case to use. `dotCase` (for `app.component.hello.messages.${LOCALE}.json`) or `paramCase` (for `app-component-hello.messages.${LOCALE}.json`)
 */
function run(localesAbsolutePath: string, angularConfigFile: string, filenameCase: FilenameCase): void {
  localesPath = localesAbsolutePath
  localeConfigs = getAngularConfigLanguages(angularConfigFile, localesPath)

  if (!Object.keys(localeConfigs).length) {
    return
  }

  splitLocales(filenameCase)
}

/**
 * Splits translation file into separate files for easier management of translation files
 *
 * @param filenameCase Filename case to use. `dotCase` (for `app.component.hello.messages.${LOCALE}.json`) or `paramCase` (for `app-component-hello.messages.${LOCALE}.json`)
 */
function splitLocales(filenameCase: FilenameCase): void {
  for (let localeKey in localeConfigs) {
    const localeFile = fs.readFileSync(localeConfigs[localeKey], 'utf8')
    const parsedDefaultLocale = JSON.parse(localeFile)
  
    const keysList: IKeysList = {}

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
      const parsedKeyArray = noCase(key).split(' ')
      if ((parsedKeyArray.length - 1) > 0) {
        let shortenKeyArray = [...parsedKeyArray]
        let shortenedKey

        if (filenameCase === 'paramCase') {
          shortenedKey = shortenKeyArray.slice(0, parsedKeyArray.length - 1).join('-')
        } else {
          shortenedKey = shortenKeyArray.slice(0, parsedKeyArray.length - 1).join('.')
        }

        if (!keysList[shortenedKey]) {
          keysList[shortenedKey] = {}
        }
        keysList[shortenedKey][parsedKeyArray[parsedKeyArray.length - 1]] = parsedDefaultLocale.translations[key]
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
      }
      const localeKeyPath = `${localesPath}/${localeKey}`
      const filename = `${localeKeyPath}/${key}.messages.${localeKey}.json`
  
      if (!fs.existsSync(localeKeyPath)) {
        fs.mkdirSync(localeKeyPath)
      }
  
      fs.writeFileSync(filename, JSON.stringify(translations, null, 2), 'utf8')
    }
  }

}

module.exports = { run }
