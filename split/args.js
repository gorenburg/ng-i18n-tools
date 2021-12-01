"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const get_absolute_path_1 = __importDefault(require("../helpers/get_absolute_path"));
/**
 * Gets the command line arguments.
 *
 * @returns Command line arguments
 */
function getArgs(rawArgs) {
    const yargsArgs = yargs_1.default(helpers_1.hideBin(rawArgs))
        .options({
        'angular-config-file': {
            description: 'Angular configuration pathname with filename',
            alias: 'acf',
            default: path_1.default.normalize(`${process.cwd()}/angular.json`),
            type: 'string'
        },
        'locales-path': {
            description: 'Default locales path',
            alias: 'lp',
            default: path_1.default.normalize(`${process.cwd()}/src/locale`),
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
        .parseSync();
    return {
        acf: get_absolute_path_1.default(yargsArgs['angular-config-file']),
        lp: get_absolute_path_1.default(yargsArgs.lp),
        fnc: yargsArgs.fnc
    };
}
exports.default = getArgs;
module.exports = { get: getArgs };
