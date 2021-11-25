"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const path_1 = __importDefault(require("path"));
const helpers_1 = require("yargs/helpers");
const get_absolute_path_1 = __importDefault(require("../helpers/get_absolute_path"));
/**
 * Gets the command line arguments.
 *
 * @returns Command line arguments
 */
function getArgs(rawArgs) {
    const srcFolder = path_1.default.normalize(`${process.cwd()}/src`);
    const yargsArgs = yargs_1.default(helpers_1.hideBin(rawArgs))
        .options({
        in: {
            description: 'Folder which will be searched recursively for translation files to be merged.',
            alias: 'i',
            default: path_1.default.normalize(srcFolder),
            type: 'string',
        },
        out: {
            description: 'Folder where the merged translation files will be saved to.',
            alias: 'o',
            default: path_1.default.normalize(`${srcFolder}/locale`),
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
        in: get_absolute_path_1.default(inPathname),
        out: get_absolute_path_1.default(yargsArgs.out),
        p: yargsArgs.p,
        s: yargsArgs.s,
    };
}
exports.default = getArgs;
module.exports = { get: getArgs };
