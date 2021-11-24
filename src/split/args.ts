import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import getAbsolutePath from '../helpers/get_absolute_path'

import { IArguments } from '../types/split'

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
        default: './src/assets/locales',
        type: 'string',
      },
      'file-name-case': {
        description: 'File naming case',
        alias: 'fnc',
        default: 'dotCase',
        choices: ['dotCase', 'paramCase']
      }
    })
    .help()
    .alias('help', 'h')
    .parseSync()

  return {
    acf: getAbsolutePath(yargsArgs['angular-config-file']),
    lp: getAbsolutePath(yargsArgs.lp as string),
    fnc: yargsArgs.fnc as string
  }
}

module.exports = { get: getArgs }
