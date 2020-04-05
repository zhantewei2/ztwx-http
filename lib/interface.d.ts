import { Observable, Subject, Subscription } from "rxjs";
export declare type HttpMethod = "get" | "post" | "put" | "delete" | "update";
export interface ValueChangePostParams {
    method: string;
    relativeUrl: string;
    url: string;
    params?: any;
    params2?: Params2;
}
export interface RequestResult {
    status: number;
    content: string;
}
export interface ValueChangeResultParams extends ValueChangePostParams {
    result: any;
}
export interface Params2 {
    headers?: {
        [key: string]: any;
    };
    expires?: number;
    key?: string;
}
export interface HttpInterface {
    setBeforeHandler: any;
    setAfterHandler: (fn: (params: RequestResult, retryFn: any) => Promise<any>) => void;
    setTicketKey: (v: string) => void;
    setTicketValue: (v: string) => void;
    httpSendBeforeHook: Subject<ValueChangePostParams>;
    httpReceiveHook: Subject<ValueChangeResultParams>;
    httpReceiveErrorHook: Subject<ValueChangeResultParams>;
    xhr: (method: string, relativeUrl: string, params?: Record<any, any>, params2?: Params2) => Observable<any>;
}
export interface HttpCacheXhr {
    method: HttpMethod;
    relativeUrl: string;
    params?: any;
    params2?: Params2;
    expires?: number;
    destroyOnXhr?: Array<string | RegExp>;
}
export interface CacheDestroyXhrObject {
    key: string;
    matchedDestroyFn?: (url: string) => boolean;
    subscription?: Subscription;
    cacheValue: string;
    xhrLoad?: Subject<any>;
}
