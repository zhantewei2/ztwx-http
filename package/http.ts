import { Observable, Subject, Subscriber, throwError } from "rxjs";
import { catchError, mergeMap, tap } from "rxjs/operators";
import {
  HttpInterface,
  Params2,
  ValueChangePostParams,
  ValueChangeResultParams,
  HttpCacheXhr,
  HttpMethod,
  BeforeFn,
  AfterFn,
  Params,
} from "./interface";
import { AllOneHttp } from "./base/all-one-http";

import { Cache } from "./cache";

export class Http implements HttpInterface {
  store: { [key: string]: string } = {};
  http: AllOneHttp = new AllOneHttp();
  beforeFn: BeforeFn;
  afterFn: AfterFn;
  hostUrl = "";
  ticketKey: string;
  ticketValue: string;
  cache: Cache;
  maxRetry:number=4;
  constructor() {
    this.cache = new Cache(this);
  }

  appendParams2 = (params2: Params2 = {}): Params2 => {
    if (this.ticketKey && this.ticketValue) {
      params2.headers = params2.headers || {};
      params2.headers[this.ticketKey] = this.ticketValue;
    }
    if(!params2.retryMax)params2.retryMax=this.maxRetry;
    if(params2.retryCurrent===undefined)params2.retryCurrent=0;
    return params2;
  };

  setBeforeHandler(fn: BeforeFn) {
    this.beforeFn = fn;
  }

  setAfterHandler(fn: AfterFn) {
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
  setMaxRetry(v:number){
    this.maxRetry=v;
  }
  httpSendBeforeHook: Subject<ValueChangePostParams> = new Subject<
    ValueChangePostParams
  >();
  httpReceiveHook: Subject<ValueChangeResultParams> = new Subject<
    ValueChangeResultParams
  >();
  httpReceiveErrorHook: Subject<ValueChangeResultParams> = new Subject<
    ValueChangeResultParams
  >();

  cacheXhr = (params: HttpCacheXhr) => this.cache.cacheXhr(params);

  xhr = (
    method: HttpMethod,
    relativeUrl: string,
    params?: Params,
    params2?: Params2,
  ): Observable<any> => {
    const url =
      (params2 && params2.root) || !this.hostUrl
        ? relativeUrl
        : this.hostUrl +
          (relativeUrl.startsWith("/") ? relativeUrl : "/" + relativeUrl);
    const valueChangePostParams = {
      url,
      relativeUrl,
      method,
      params,
      params2,
    };

    this.httpSendBeforeHook.next(valueChangePostParams);
    params2=this.appendParams2(params2);

    this.beforeFn && this.beforeFn(params, params2);
    return this.http
      .xhr({
        method,
        url,
        params,
        headers: (params2 || {}).headers,
        key: (params2 || {}).key,
      })
      .pipe(
        mergeMap(
          (result) =>
            new Observable((ob: Subscriber<any>) => {
              // @ts-ignore
              if(params2.retryCurrent&&params2.retryCurrent>params2.retryMax)return ob.error("over max retry");
              if (this.afterFn) {
                this.afterFn({
                  params,
                  params2,
                  result,
                  retry:()=>{
                    // @ts-ignore
                    params2.retryCurrent++;
                    return this.xhr(method, relativeUrl, params, params2)
                  },
                })
                  .then((resultNext: any) => {
                    ob.next(resultNext)
                    ob.complete();
                  })
                  .catch((err) => {
                    ob.error(err)
                  });
              } else {
                ob.next(result);
                ob.complete();
              }
            }),
        ),
        catchError((err: any) => {
          this.httpReceiveErrorHook.next(
            Object.assign(valueChangePostParams, { result: err }),
          );
          return throwError(err);
        }),
        tap((result: any) => {
          this.httpReceiveHook.next(
            Object.assign(valueChangePostParams, { result }),
          );
        }),
      );
  };
}

export const http = new Http();
