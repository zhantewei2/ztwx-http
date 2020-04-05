import { HttpInterface, HttpCacheXhr, CacheDestroyXhrObject } from "./interface";
import { Observable } from "rxjs";
export declare class Cache {
    private cacheExpireTag;
    private http;
    private cacheDestroyDict;
    constructor(http: HttpInterface);
    cacheXhr({ method, expires, relativeUrl, params, params2, destroyOnXhr }: HttpCacheXhr): Observable<any>;
    cacheExpiredJsonForCacheValue(cacheDestroy: CacheDestroyXhrObject, expires: number): void;
    removeCacheDestroy(key: string): void;
    matchedDestroyFnFactory(matchedList: Array<string | RegExp>): (url: string) => boolean;
}
