import { EntityMetadata, AnyEntity, Dictionary } from '../typings';
import { EntityManager } from '../EntityManager';
import { EventSubscriber } from '../events';
export declare class MetadataStorage {
    private static readonly metadata;
    private static readonly subscribers;
    private readonly metadata;
    constructor(metadata?: Dictionary<EntityMetadata>);
    static getMetadata(): Dictionary<EntityMetadata>;
    static getMetadata<T extends AnyEntity<T> = any>(entity: string, path: string): EntityMetadata<T>;
    static getMetadataFromDecorator<T = any>(target: T & Dictionary): EntityMetadata<T>;
    static getSubscriberMetadata(): Dictionary<EventSubscriber>;
    static init(): MetadataStorage;
    getAll(): Dictionary<EntityMetadata>;
    get<T extends AnyEntity<T> = any>(entity: string, init?: boolean, validate?: boolean): EntityMetadata<T>;
    find<T extends AnyEntity<T> = any>(entity: string): EntityMetadata<T> | undefined;
    has(entity: string): boolean;
    set(entity: string, meta: EntityMetadata): EntityMetadata;
    reset(entity: string): void;
    decorate(em: EntityManager): void;
}
