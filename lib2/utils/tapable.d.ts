export declare class Tapable<T> {
    list: Array<(p: T) => void>;
    tap(callback: (p: T) => void): void;
    run(p: T): void;
}
export declare class TapableInline<T> {
    list: Array<(p: T) => T>;
    tap(callback: (p: T) => T): void;
    runInline(p: T): T;
}
export interface TapableAsyncRun<T> {
    (p: T): Promise<any>;
}
export declare class TapableAsync<T> {
    list: Array<TapableAsyncRun<T>>;
    tapAsync(callback: TapableAsyncRun<T>): void;
    /**
     * prevent next when @return false
     * @param p
     * @param mdBreak  break async if mdBreak exit
     */
    run(p: T, mdBreak?: boolean): Promise<any>;
}
