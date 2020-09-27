"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const metadata_1 = require("../metadata");
const utils_1 = require("../utils");
function Entity(options = {}) {
    return function (target) {
        const meta = metadata_1.MetadataStorage.getMetadataFromDecorator(target);
        utils_1.Utils.merge(meta, options);
        meta.class = target;
        meta.name = target.name;
        return target;
    };
}
exports.Entity = Entity;
