export declare class Tapable<T> {
    list: Array<{
        run: (p: T) => void;
        priority: number;
    }>;
    tap(run: (p: T) => void, priority: number): void;
    run(p: T): void;
}
export declare class TapableInline<T> {
    list: Array<{
        run: (p: T) => T;
        priority: number;
    }>;
    tap(run: (p: T) => T, priority: number): void;
    runInline(p: T): T;
}
export interface TapableAsyncRun<T> {
    (p: T): Promise<any>;
}
export declare class TapableAsync<T> {
    list: Array<{
        run: TapableAsyncRun<T>;
        priority: number;
    }>;
    tapAsync(callback: TapableAsyncRun<T>, priority: number): void;
    /**
     * prevent next when @return false
     * @param p
     * @param mdBreak  break async if mdBreak exit
     */
    run(p: T, mdBreak?: boolean): Promise<any>;
}
