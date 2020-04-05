import {Observable, Subject, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {
    HttpInterface, Params2, ValueChangePostParams, ValueChangeResultParams, RequestResult,
    HttpCacheXhr
} from "./interface";

const {CacheHttp} = require("cache-ajax");
import {Cache} from "./cache";


export type FilterFn = (result: any, retryFn: any) => Promise<any>;

export class Http implements HttpInterface {
    store: { [key: string]: string } = {};
    cacheHttp: any;
    beforeFn: any;
    afterFn: FilterFn;
    hostUrl: string;
    ticketKey: string;
    ticketValue: string;
    cache: Cache;

    constructor() {
        this.cacheHttp = new CacheHttp({},
            (params: any) => this.beforeFn ? this.beforeFn(params) : params,
            (result: any, retryFn: any) => this.afterFn ? this.afterFn(result, retryFn) : Promise.resolve(result)
        );
        this.cache = new Cache(this);
    }

    appendTicketHeader = (params2: Params2 = {}): Params2 => {
        if (this.ticketKey && this.ticketValue) {
            params2.headers = params2.headers ? {
                ...params2.headers,
                [this.ticketKey]: this.ticketValue
            } : {[this.ticketKey]: this.ticketValue}
        }

        return params2;
    };

    setBeforeHandler(fn: (params: Record<any, any>) => void) {
        this.beforeFn = fn;
    }

    setAfterHandler(fn: (params: RequestResult, retryFn: any) => Promise<any>) {
        this.afterFn = fn;
    }

    setHost(host: string) {
        this.hostUrl = host;
    }

    setTicketKey(key: string) {
        this.ticketKey = key;
    }

    setTicketValue(v: string) {
        this.ticketValue = v;
    }

    httpSendBeforeHook: Subject<ValueChangePostParams> = new Subject<ValueChangePostParams>();
    httpReceiveHook: Subject<ValueChangeResultParams> = new Subject<ValueChangeResultParams>();
    httpReceiveErrorHook: Subject<ValueChangeResultParams> = new Subject<ValueChangeResultParams>();

    cacheXhr = (params: HttpCacheXhr) => this.cache.cacheXhr(params);
    
    xhr = (
        method: string,
        relativeUrl: string,
        params?: Record<any, any>,
        params2?: Params2
    ): Observable<any> => {
        const url = this.hostUrl + (relativeUrl.startsWith("/") ? relativeUrl : "/" + relativeUrl);
        const valueChangePostParams = {
            url,
            relativeUrl,
            method,
            params,
            params2
        };

        this.httpSendBeforeHook.next(valueChangePostParams);

        return this.cacheHttp.xhr(
            method,
            url,
            params,
            this.appendTicketHeader(params2)
        ).pipe(
            catchError((err: any) => {
                this.httpReceiveErrorHook.next(
                    Object.assign(valueChangePostParams, {result: err})
                );
                return throwError(err)
            }),
            tap((result: any) => {
                this.httpReceiveHook.next(
                    Object.assign(valueChangePostParams, {result})
                );
            })
        )
    }
}

export const http = new Http();