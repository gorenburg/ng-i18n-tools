import path from 'path'
import getParsedFileData from './get_parsed_file'

export default function getAngularConfigLanguages(filepath: string, overriddenLocalesPath?: string): { [key: string]: string } {
  const fileData = getParsedFileData(filepath)
  if (!fileData) { return {} }

  const languages: { [key: string]: string } = {}

  for (let project in fileData.projects) {
    const projectI18nSettings = fileData.projects[project].i18n
    if (projectI18nSettings && projectI18nSettings.locales && Object.keys(projectI18nSettings.locales).length) {
      for (const [key, value] of Object.entries(projectI18nSettings.locales)) {
        if (overriddenLocalesPath) {
          languages[key] = `${path.normalize(overriddenLocalesPath)}/messages.${key}.json`
        } else {
          languages[key] = value as string
        }
      }
    }
  }

  if (!Object.keys(languages).length) {
    console.error('No languages found in the config')
    return {}
  }

  return languages
}
