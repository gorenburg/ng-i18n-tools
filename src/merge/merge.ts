import fs from 'fs'
import glob from 'glob'
import path from 'path'
import { paramCase, dotCase, camelCase } from 'change-case'

const messagesFilenameGlobPattern = '/**/*.messages.*.json'
const messagesFilenameRegex = /.messages.(.*).json$/i
const messagesNameRegex = /.+?(?=.messages.)/i

/**
 * Merges the multiple partial messages files into a single message file per language.
 *
 * It will recursively find partial message files with pattern '/xx/x.messages.x.json' under the input root folder and
 * create an output file at the output folder for each of the languages found.
 *
 * @param inputRootFolder Input root folder containing partial message files
 * @param outputFolder Output folder where the merged files will be saved
 * @param identifierPrefix: Adds a prefix to the translation identifier based on the translation filename (see --id-prefix-strategy)
 * @param identifierPrefixStrategy: Naming strategy applied to the translation filename to generate the identifier prefix
 */
function run(inputRootFolder: string, outputFolder: string, identifierPrefix: string, identifierPrefixStrategy: string): void {
  glob(inputRootFolder + messagesFilenameGlobPattern, {}, (err, messageFilePaths) => {
    if (err) {
        console.error(err);
        process.exit(-1);
    }

    const langJsonMap = buildLangJsonMap(messageFilePaths, identifierPrefix, identifierPrefixStrategy)
    saveToFiles(langJsonMap, outputFolder)

    if (langJsonMap.size === 0) {
      console.warn(`Didn't find any files on folder '${inputRootFolder}' matching pattern '${messagesFilenameGlobPattern}'.`)
    }
  })
}

/**
 * Builds a map containing the language code as the key and the JSON on the format expected by Angular Localization as the key.
 *
 * @param messageFilePaths Paths of the files containing partial translation
 * @returns Map
 */
 function buildLangJsonMap(messageFilePaths: string[], identifierPrefix: string, identifierPrefixStrategy: string): Map<any, any> {
  let langJsonMap = new Map()

  messageFilePaths.forEach(messageFilePath => {
    const messageFileContent = fs.readFileSync(path.normalize(messageFilePath), 'utf8')

    const messageJson = JSON.parse(messageFileContent);

    if (identifierPrefix) {
      const filename = getNameFromFilename(messageFilePath);
      const parsedFilename = filename.replace(/\.|-|\_/g, ' ')
      for (const property in messageJson) {
        Object.defineProperty(messageJson, buildKeyName(filename + ' ' + property, identifierPrefixStrategy), Object.getOwnPropertyDescriptor(messageJson, property)!)
        delete messageJson[property]
      }
    }

    const langCode = getLanguageCodeFromFilename(messageFilePath)

    if (!langJsonMap.has(langCode)) {
      langJsonMap.set(langCode, {locale: langCode, translations: {}})
    }

    const mergedJson = langJsonMap.get(langCode)
    Object.assign(mergedJson.translations, messageJson)
  })

  return langJsonMap
}

/**
* Saves all the translation files present in the language JSON map to the output folder
*
* @param langJsonMap Language JSON map
* @param outputFolder Output folder where the merged files will be saved
*/
function saveToFiles(langJsonMap: Map<any, any>, outputFolder: string): void {
  fs.mkdirSync(outputFolder, { recursive: true })

  langJsonMap.forEach((json, language) => {
    const mergedFilePath = outputFolder + `/messages.${language}.json`
    fs.writeFileSync(mergedFilePath, JSON.stringify(json, null, 2))

    console.log(`Merged translation file generated at: ${path.normalize(mergedFilePath)}`);
  })
}

/**
* Builds key name
*
* @param key Key name to transform
* @param prefixStrategy Prefix strategy
* @returns Key
*/
function buildKeyName(key: string, prefixStrategy: string): string {
  if (prefixStrategy === 'as-is') {
      return paramCase(key)
  }
  if (prefixStrategy === 'dot-case') {
      return dotCase(key)
  }
  return camelCase(key)
}

/**
* Extracts name from the filename.
*
* @param filename Filename
* @returns File name
*/
function getNameFromFilename(filename: string): string {
  const fullFilename = path.basename(filename)
  return messagesNameRegex.exec(fullFilename)![0]
}

/**
* Extracts the language code from the filename.
*
* @param filename Filename
* @returns Language code
*/
function getLanguageCodeFromFilename(filename: string): string {
  return messagesFilenameRegex.exec(filename)![1]
}

module.exports = { run }
