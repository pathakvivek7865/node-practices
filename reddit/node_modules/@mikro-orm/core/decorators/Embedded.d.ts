import { AnyEntity } from '../typings';
export declare function Embedded(options?: EmbeddedOptions | (() => AnyEntity)): (target: AnyEntity, propertyName: string) => void;
export declare type EmbeddedOptions = {
    entity?: string | (() => AnyEntity);
    type?: string;
    prefix?: string | boolean;
    nullable?: boolean;
};
