import { Platform } from '../platforms';
import { Constructor, EntityProperty } from '../typings';
export declare abstract class Type<JSType = string, DBType = JSType> {
    private static readonly types;
    /**
     * Converts a value from its JS representation to its database representation of this type.
     */
    convertToDatabaseValue(value: JSType | DBType, platform: Platform): DBType;
    /**
     * Converts a value from its database representation to its JS representation of this type.
     */
    convertToJSValue(value: JSType | DBType, platform: Platform): JSType;
    /**
     * Converts a value from its JS representation to its serialized JSON form of this type.
     * By default uses the runtime value.
     */
    toJSON(value: JSType, platform: Platform): JSType | DBType;
    /**
     * Gets the SQL declaration snippet for a field of this type.
     */
    getColumnType(prop: EntityProperty, platform: Platform): string;
    static getType<JSType, DBType>(cls: Constructor<Type<JSType, DBType>>): Type<JSType, DBType>;
}
