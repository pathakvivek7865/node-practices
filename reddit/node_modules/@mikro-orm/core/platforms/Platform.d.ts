import { EntityRepository } from '../entity';
import { NamingStrategy } from '../naming-strategy';
import { Constructor, Dictionary, EntityProperty, IPrimaryKey, Primary, ISchemaGenerator } from '../typings';
import { ExceptionConverter } from './ExceptionConverter';
import { EntityManager } from '../EntityManager';
export declare abstract class Platform {
    protected readonly exceptionConverter: ExceptionConverter;
    usesPivotTable(): boolean;
    supportsTransactions(): boolean;
    usesImplicitTransactions(): boolean;
    getNamingStrategy(): {
        new (): NamingStrategy;
    };
    usesReturningStatement(): boolean;
    usesCascadeStatement(): boolean;
    getSchemaHelper(): {
        getTypeDefinition(prop: EntityProperty, types?: Dictionary<string[]>, lengths?: Dictionary<number>, allowZero?: boolean): string;
    } | undefined;
    requiresNullableForAlteringColumn(): boolean;
    allowsMultiInsert(): boolean;
    /**
     * Normalizes primary key wrapper to scalar value (e.g. mongodb's ObjectId to string)
     */
    normalizePrimaryKey<T extends number | string = number | string>(data: Primary<T> | IPrimaryKey): T;
    /**
     * Converts scalar primary key representation to native driver wrapper (e.g. string to mongodb's ObjectId)
     */
    denormalizePrimaryKey(data: IPrimaryKey): IPrimaryKey;
    /**
     * Used when serializing via toObject and toJSON methods, allows to use different PK field name (like `id` instead of `_id`)
     */
    getSerializedPrimaryKeyField(field: string): string;
    /**
     * Returns the SQL specific for the platform to get the current timestamp
     */
    getCurrentTimestampSQL(length: number): string;
    getDateTypeDeclarationSQL(length: number): string;
    getTimeTypeDeclarationSQL(length: number): string;
    getRegExpOperator(): string;
    isBigIntProperty(prop: EntityProperty): boolean;
    getBigIntTypeDeclarationSQL(): string;
    getArrayDeclarationSQL(): string;
    marshallArray(values: string[]): string;
    unmarshallArray(value: string): string[];
    getBlobDeclarationSQL(): string;
    getJsonDeclarationSQL(): string;
    convertsJsonAutomatically(marshall?: boolean): boolean;
    getRepositoryClass<T>(): Constructor<EntityRepository<T>>;
    getDefaultCharset(): string;
    getExceptionConverter(): ExceptionConverter;
    getSchemaGenerator(em: EntityManager): ISchemaGenerator;
}
