export declare class Store<T> {
    maxCount: number;
    disCount: number;
    maxCountRel: number;
    size: number;
    constructor(maxCount?: number, disCount?: number);
    map: Map<string, T>;
    setValue(key: string, value: any): void;
    getValue(key: string): any;
    deleteKey(key: string): any;
    clearNest(): void;
}
