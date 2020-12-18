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
  HttpOpts,
  HttpRequestLib,
} from "./interface";
import { AllOneHttp } from "./base/all-one-http";

import { Cache } from "./cache";

export class Http implements HttpInterface {
  store: { [key: string]: string } = {};
  http: AllOneHttp;
  beforeFn: BeforeFn;
  afterFn: AfterFn;
  hostUrl = "";
  ticketKey: string;
  ticketValue: string;
  cache: Cache;
  maxRetry = 4;
  globalHeaders: { [key: string]: string } = {};
  globalHeadersPriority: { [key: string]: string } = {};
  requestLib: HttpRequestLib;
  withCredentials = true;
  setWithCredentials(v: boolean) {
    this.withCredentials = v;
  }
  setGlobalHeader(key: string, value: string, priority?: boolean) {
    priority
      ? (this.globalHeadersPriority[key] = value)
      : (this.globalHeaders[key] = value);
  }
  clearGlobalHeader(key: string) {
    delete this.globalHeaders[key];
  }
  setGlobalHeaders(headers: { [key: string]: string }) {
    Object.assign(this.globalHeaders, headers);
  }
  clearGlobalHeaders() {
    this.globalHeaders = {};
  }
  constructor(httpOpts?: HttpOpts) {
    this.cache = new Cache(this);
    this.requestLib = (httpOpts && httpOpts.requestLib) || "auto";
    this.http = new AllOneHttp(this.requestLib);
  }
  appendParams2 = (params2: Params2 = {}): Params2 => {
    params2.headers = params2.headers || {};
    params2.headers = params2.priorityHeaders
      ? {
          ...this.globalHeaders,
          ...this.globalHeadersPriority,
          ...params2.headers,
        }
      : {
          ...this.globalHeaders,
          ...params2.headers,
          ...this.globalHeadersPriority,
        };

    if (!params2.retryMax) params2.retryMax = this.maxRetry;
    if (params2.retryCurrent === undefined) params2.retryCurrent = 0;
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
    if (this.ticketValue)
      this.setGlobalHeader(this.ticketKey, this.ticketValue, true);
  }

  setTicketValue(v: string) {
    this.ticketValue = v;
    if (this.ticketKey)
      this.setGlobalHeader(this.ticketKey, this.ticketValue, true);
  }
  setMaxRetry(v: number) {
    this.maxRetry = v;
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

  public xhr = (
    method: HttpMethod,
    relativeUrl: string,
    params?: Params,
    params2?: Params2,
  ): Observable<any> => {
    const url =
      (params2 && params2.root) || !this.hostUrl
        ? relativeUrl
        : this.hostUrl +
          (relativeUrl[0] === "/" ? relativeUrl : "/" + relativeUrl);
    const valueChangePostParams = {
      url,
      relativeUrl,
      method,
      params,
      params2,
    };

    this.httpSendBeforeHook.next(valueChangePostParams);
    params2 = this.appendParams2(params2);

    this.beforeFn && this.beforeFn(params, params2);
    const withCredentials =
      params2.withCredentials === undefined
        ? this.withCredentials
        : params2.withCredentials;
    const httpSub = params2.notQueue
      ? this.http.baseHttp.send(
          method,
          url,
          params,
          params2.headers,
          withCredentials,
        )
      : this.http.xhr({
          method,
          url,
          params,
          headers: params2.headers,
          key: params2.key,
          withCredentials,
        });

    return httpSub.pipe(
      mergeMap(
        (result) =>
          new Observable((ob: Subscriber<any>) => {
            if (
              (params2 as any).retryCurrent &&
              (params2 as any).retryCurrent > (params2 as any).retryMax
            )
              return ob.error("over max retry");
            if (this.afterFn) {
              this.afterFn({
                params,
                params2,
                result,
                retry: () => {
                  (params2 as any).retryCurrent++;
                  return this.xhr(method, relativeUrl, params, params2);
                },
              })
                .then((resultNext: any) => {
                  ob.next(resultNext);
                  ob.complete();
                })
                .catch((err) => {
                  ob.error(err);
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
