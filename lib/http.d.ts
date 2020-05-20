import { Observable, Subject } from "rxjs";
import { HttpInterface, Params2, ValueChangePostParams, ValueChangeResultParams, HttpCacheXhr, HttpMethod, BeforeFn, AfterFn } from "./interface";
import { AllOneHttp } from "./base/all-one-http";
import { Cache } from "./cache";
export declare class Http implements HttpInterface {
    store: {
        [key: string]: string;
    };
    http: AllOneHttp;
    beforeFn: BeforeFn;
    afterFn: AfterFn;
    hostUrl: string;
    ticketKey: string;
    ticketValue: string;
    cache: Cache;
    constructor();
    appendTicketHeader: (params2?: Params2) => Params2;
    setBeforeHandler(fn: BeforeFn): void;
    setAfterHandler(fn: AfterFn): void;
    setHost(host: string): void;
    setTicketKey(key: string): void;
    setTicketValue(v: string): void;
    httpSendBeforeHook: Subject<ValueChangePostParams>;
    httpReceiveHook: Subject<ValueChangeResultParams>;
    httpReceiveErrorHook: Subject<ValueChangeResultParams>;
    cacheXhr: (params: HttpCacheXhr) => Observable<any>;
    xhr: (method: HttpMethod, relativeUrl: string, params?: any, params2?: Params2 | undefined) => Observable<any>;
}
export declare const http: Http;
