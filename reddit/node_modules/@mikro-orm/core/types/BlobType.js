"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlobType = void 0;
const Type_1 = require("./Type");
class BlobType extends Type_1.Type {
    convertToDatabaseValue(value, platform) {
        return value;
    }
    convertToJSValue(value, platform) {
        if (!value) {
            return value;
        }
        if (value.buffer instanceof Buffer) {
            return value.buffer;
        }
        return Buffer.from(value);
    }
    getColumnType(prop, platform) {
        return platform.getBlobDeclarationSQL();
    }
}
exports.BlobType = BlobType;
