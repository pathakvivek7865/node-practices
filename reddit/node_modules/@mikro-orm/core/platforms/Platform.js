"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Platform = void 0;
const entity_1 = require("../entity");
const naming_strategy_1 = require("../naming-strategy");
const ExceptionConverter_1 = require("./ExceptionConverter");
class Platform {
    constructor() {
        this.exceptionConverter = new ExceptionConverter_1.ExceptionConverter();
    }
    usesPivotTable() {
        return false;
    }
    supportsTransactions() {
        return true;
    }
    usesImplicitTransactions() {
        return true;
    }
    getNamingStrategy() {
        return naming_strategy_1.UnderscoreNamingStrategy;
    }
    usesReturningStatement() {
        return false;
    }
    usesCascadeStatement() {
        return false;
    }
    getSchemaHelper() {
        return undefined;
    }
    requiresNullableForAlteringColumn() {
        return false;
    }
    allowsMultiInsert() {
        return true;
    }
    /**
     * Normalizes primary key wrapper to scalar value (e.g. mongodb's ObjectId to string)
     */
    normalizePrimaryKey(data) {
        return data;
    }
    /**
     * Converts scalar primary key representation to native driver wrapper (e.g. string to mongodb's ObjectId)
     */
    denormalizePrimaryKey(data) {
        return data;
    }
    /**
     * Used when serializing via toObject and toJSON methods, allows to use different PK field name (like `id` instead of `_id`)
     */
    getSerializedPrimaryKeyField(field) {
        return field;
    }
    /**
     * Returns the SQL specific for the platform to get the current timestamp
     */
    getCurrentTimestampSQL(length) {
        return 'current_timestamp' + (length ? `(${length})` : '');
    }
    getDateTypeDeclarationSQL(length) {
        return 'date' + (length ? `(${length})` : '');
    }
    getTimeTypeDeclarationSQL(length) {
        return 'time' + (length ? `(${length})` : '');
    }
    getRegExpOperator() {
        return 'regexp';
    }
    isBigIntProperty(prop) {
        return prop.columnTypes && prop.columnTypes[0] === 'bigint';
    }
    getBigIntTypeDeclarationSQL() {
        return 'bigint';
    }
    getArrayDeclarationSQL() {
        return 'text';
    }
    marshallArray(values) {
        return values.join(',');
    }
    unmarshallArray(value) {
        return value.split(',');
    }
    getBlobDeclarationSQL() {
        return 'blob';
    }
    getJsonDeclarationSQL() {
        return 'json';
    }
    convertsJsonAutomatically(marshall = false) {
        return !marshall;
    }
    getRepositoryClass() {
        return entity_1.EntityRepository;
    }
    getDefaultCharset() {
        return 'utf8';
    }
    getExceptionConverter() {
        return this.exceptionConverter;
    }
    getSchemaGenerator(em) {
        throw new Error(`${this.constructor.name} does not use a schema generator`);
    }
}
exports.Platform = Platform;
