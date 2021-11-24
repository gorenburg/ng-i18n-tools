"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
/**
 * Gets the given path as an absolute path.
 *
 * If the path is relative, it will be resolved against the current working directory.
 *
 * @param givenPath Given path
 * @returns Absolute path
 */
function getAbsolutePath(givenPath) {
    if (path_1.default.isAbsolute(givenPath)) {
        return givenPath;
    }
    else {
        return path_1.default.resolve(process.cwd(), givenPath);
    }
}
exports.default = getAbsolutePath;
