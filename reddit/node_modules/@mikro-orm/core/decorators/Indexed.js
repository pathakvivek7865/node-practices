"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unique = exports.Index = void 0;
const metadata_1 = require("../metadata");
function createDecorator(options, unique) {
    return function (target, propertyName) {
        const meta = metadata_1.MetadataStorage.getMetadataFromDecorator(propertyName ? target.constructor : target);
        options.properties = options.properties || propertyName;
        const key = unique ? 'uniques' : 'indexes';
        meta[key].push(options);
    };
}
function Index(options = {}) {
    return createDecorator(options, false);
}
exports.Index = Index;
function Unique(options = {}) {
    return createDecorator(options, true);
}
exports.Unique = Unique;
