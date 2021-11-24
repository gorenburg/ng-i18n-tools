export interface ITranslationSettings {
  [key: string]: {
    filepath: string
    isFileExists: boolean
    translations: { [key: string]: string }
  }
}

export interface ICompiledTranslationFileData {
  locale: string
  translations: { [key: string]: string }
}
