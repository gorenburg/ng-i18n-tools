"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const get_absolute_path_1 = __importDefault(require("../helpers/get_absolute_path"));
/**
 * Gets the command line arguments.
 *
 * @returns Command line arguments
 */
function getArgs(rawArgs) {
    const yargsArgs = (0, yargs_1.default)((0, helpers_1.hideBin)(rawArgs))
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
        .parseSync();
    const inPathname = Array.isArray(yargsArgs.in) ? yargsArgs.in[yargsArgs.in.length - 1] : yargsArgs.in;
    return {
        in: (0, get_absolute_path_1.default)(inPathname),
        out: (0, get_absolute_path_1.default)(yargsArgs.out),
        p: yargsArgs.p,
        s: yargsArgs.s,
    };
}
exports.default = getArgs;
module.exports = { get: getArgs };
