import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import getAbsolutePath from '../helpers/get_absolute_path'

/**
 * Gets the command line arguments.
 *
 * @returns Command line arguments
 */
export default function getArgs(rawArgs: string[]) {
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
        type: 'string'
      }
    })
    .help()
    .alias('help', 'h')
    .parseSync()

  return {
    acf: getAbsolutePath(yargsArgs.acf as string),
    lp: getAbsolutePath(yargsArgs.lp as string)
  }
}

module.exports = { get: getArgs }
