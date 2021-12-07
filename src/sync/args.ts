import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import getAbsolutePath from '../helpers/get_absolute_path'

import { IArguments } from '../types/sync'

/**
 * Gets the command line arguments.
 *
 * @returns Command line arguments
 */
export default function getArgs(rawArgs: string[]): IArguments {
  const yargsArgs = yargs(hideBin(rawArgs))
    .options({
      'angular-config-file': {
        description: 'Angular configuration pathname with filename',
        alias: 'acf',
        default: './angular.json',
        type: 'string'
      },
      'locales-path': {
        description: 'Default locales path',
        alias: 'lp',
        default: './src/locales',
        type: 'string'
      },
      'default-fallback': {
        description: "Fallback to default locale key's value if key is missing in the translation file",
        alias: 'df',
        default: false,
        type: 'boolean'
      }
    })
    .help()
    .alias('help', 'h')
    .parseSync()

  return {
    acf: getAbsolutePath(yargsArgs.acf as string),
    lp: getAbsolutePath(yargsArgs.lp as string),
    df: yargsArgs.df as boolean
  }
}

module.exports = { get: getArgs }
