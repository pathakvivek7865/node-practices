import { AnyEntity } from '../typings';
export declare function Formula(formula: string | ((alias: string) => string)): (target: AnyEntity, propertyName: string) => void;
