export declare class LimitStore<T> {
    store: Map<string, T>;
    total: number;
    maxCount: number;
    controllerCount: number;
    constructor(maxCount?: number, controllerCount?: number);
    add(key: string, val: T): void;
    has(key: string): boolean;
    get(key: string): T | undefined;
    addCheck(): void;
    del(key: string): void;
}
