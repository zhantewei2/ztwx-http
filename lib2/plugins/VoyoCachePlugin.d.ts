import { BeForeBreakInfo, HttpAfterParams, HttpBeforeParams, VoyoHttpPlugin } from "../high-base/VoyoHttpPlugin";
export { LimitStore } from "./limitStore";
import { LimitStore } from "./limitStore";
import { Response } from "../base/Response";
import { Request } from "../base/Request";
declare module "../types/http-params.type" {
    interface HttpParams {
        cacheOpts?: {
            key: string;
            expireSeconds?: number;
        };
    }
}
export interface VoyoCachePluginOpts {
    maxCount?: number;
    controllerCount?: number;
    defaultExpireSeconds?: number;
}
export interface CacheHttp {
    res: Response;
    req: Request;
}
export interface VoyoCacheStoreVal {
    expireDate: number;
    http: CacheHttp;
}
export declare class VoyoCachePlugin implements VoyoHttpPlugin {
    name: string;
    priority: number;
    defaultExpireSeconds: number;
    limitStore: LimitStore<VoyoCacheStoreVal>;
    getNowDate(): number;
    constructor({ maxCount, controllerCount, defaultExpireSeconds, }: VoyoCachePluginOpts);
    isExpire(key: string, expireDate: number): boolean;
    before({ http, httpParams: { cacheOpts }, }: HttpBeforeParams): Promise<void | BeForeBreakInfo>;
    after(result: HttpAfterParams, { httpParams: { cacheOpts }, http }: HttpBeforeParams): Promise<void>;
}
