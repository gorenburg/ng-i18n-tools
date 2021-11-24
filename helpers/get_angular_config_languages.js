"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_parsed_file_1 = __importDefault(require("./get_parsed_file"));
function getAngularConfigLanguages(filepath, overriddenLocalesPath) {
    const fileData = get_parsed_file_1.default(filepath);
    if (!fileData) {
        return {};
    }
    const languages = {};
    for (let project in fileData.projects) {
        const projectI18nSettings = fileData.projects[project].i18n;
        if (projectI18nSettings && projectI18nSettings.locales && Object.keys(projectI18nSettings.locales).length) {
            for (const [key, value] of Object.entries(projectI18nSettings.locales)) {
                if (overriddenLocalesPath) {
                    languages[key] = `${overriddenLocalesPath}/messages.${key}.json`;
                }
                else {
                    languages[key] = value;
                }
            }
        }
    }
    if (!Object.keys(languages).length) {
        console.error('No languages found in the config');
        return {};
    }
    return languages;
}
exports.default = getAngularConfigLanguages;
