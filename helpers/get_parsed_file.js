"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function getParsedFileData(filepath) {
    const fileDest = path_1.default.normalize(filepath);
    if (!fs_1.default.existsSync(fileDest)) {
        console.log(`File read error: ${fileDest}`);
    }
    const file = fs_1.default.readFileSync(fileDest, 'utf8');
    return JSON.parse(file);
}
exports.default = getParsedFileData;
