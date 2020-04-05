import { Observable, Subject } from "rxjs";
import { HttpInterface, Params2, ValueChangePostParams, ValueChangeResultParams, RequestResult, HttpCacheXhr } from "./interface";
import { Cache } from "./cache";
export declare type FilterFn = (result: any, retryFn: any) => Promise<any>;
export declare class Http implements HttpInterface {
    store: {
        [key: string]: string;
    };
    cacheHttp: any;
    beforeFn: any;
    afterFn: FilterFn;
    hostUrl: string;
    ticketKey: string;
    ticketValue: string;
    cache: Cache;
    constructor();
    appendTicketHeader: (params2?: Params2) => Params2;
    setBeforeHandler(fn: (params: Record<any, any>) => void): void;
    setAfterHandler(fn: (params: RequestResult, retryFn: any) => Promise<any>): void;
    setHost(host: string): void;
    setTicketKey(key: string): void;
    setTicketValue(v: string): void;
    httpSendBeforeHook: Subject<ValueChangePostParams>;
    httpReceiveHook: Subject<ValueChangeResultParams>;
    httpReceiveErrorHook: Subject<ValueChangeResultParams>;
    cacheXhr: (params: HttpCacheXhr) => Observable<any>;
    xhr: (method: string, relativeUrl: string, params?: Record<any, any> | undefined, params2?: Params2 | undefined) => Observable<any>;
}
export declare const http: Http;
