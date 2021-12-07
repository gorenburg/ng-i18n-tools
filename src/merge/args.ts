import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import getAbsolutePath from '../helpers/get_absolute_path'

import { IArguments } from '../types/merge'

/**
 * Gets the command line arguments.
 *
 * @returns Command line arguments
 */
export default function getArgs(rawArgs: string[]): IArguments {
  const yargsArgs = yargs(hideBin(rawArgs))
    .options({
      in: {
        description: 'Folder which will be searched recursively for translation files to be merged.',
        alias: 'i',
        default: './src/locales',
        type: 'string',
      },
      out: {
        description: 'Folder where the merged translation files will be saved to.',
        alias: 'o',
        default: './src/locales',
        type: 'string',
      },
      'id-prefix': {
        description: 'Adds a prefix to the translation identifier based on the translation filename (see --id-prefix-strategy)',
        alias: 'p',
        default: false,
        type: 'boolean'
      },
      'id-prefix-strategy': {
        description: 'Naming strategy applied to the translation filename to generate the identifier prefix',
        alias: 's',
        default: 'camel-case',
        choices: ['camel-case', 'as-is', 'dot-case']
      }
    })
    .help()
    .alias('help', 'h')
    .parseSync()

  const inPathname: string = Array.isArray(yargsArgs.in) ? yargsArgs.in[yargsArgs.in.length - 1] : yargsArgs.in

  return {
    in: getAbsolutePath(inPathname as string),
    out: getAbsolutePath(yargsArgs.out as string),
    p: yargsArgs.p as string,
    s: yargsArgs.s as string,
  }
}

module.exports = { get: getArgs }
