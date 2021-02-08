import { Observable, Subject, Subscription } from "rxjs";

export type HttpRequestLib = "ajax" | "uni" | "auto";

export interface HttpOpts {
  requestLib: HttpRequestLib; //default "auto
}

export type HttpMethod =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "update"
  | "postForm"
  | "putForm"
  | "postStream";
export type UniMethod =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "connect"
  | "head"
  | "options"
  | "trace";

export interface ValueChangePostParams {
  method: string;
  relativeUrl: string;
  url: string;
  params?: any;
  params2?: Params2;
}

export interface RequestResult {
  status: number;
  content: string | Record<string, any>;
  header?: Record<string, string>;
}

export interface ValueChangeResultParams extends ValueChangePostParams {
  result: any;
}
export type Params = Record<string, any> | string | ArrayBuffer | Blob | any;
export type Headers = Record<string, string>;

export interface Params2 {
  headers?: { [key: string]: any };
  expires?: number;
  key?: string;
  root?: string | boolean;
  retryMax?: number;
  retryCurrent?: number;
  notQueue?: boolean; // not wait queue
  priorityHeaders?: boolean;
  withCredentials?: boolean;
  isUrlMethod?: boolean;
  responseType?: XMLHttpRequestResponseType;
}

export interface HttpInterface {
  setBeforeHandler: any;
  setAfterHandler: (fn: AfterFn) => void;
  setTicketKey: (v: string) => void;
  setTicketValue: (v: string) => void;
  setGlobalHeader: (key: string, value: string, priority?: boolean) => void;
  httpSendBeforeHook: Subject<ValueChangePostParams>;
  httpReceiveHook: Subject<ValueChangeResultParams>;
  httpReceiveErrorHook: Subject<ValueChangeResultParams>;
  xhr: (
    method: HttpMethod,
    relativeUrl: string,
    params?: Record<any, any>,
    params2?: Params2,
  ) => Observable<any>;
}

export interface HttpCacheXhr {
  method: HttpMethod;
  relativeUrl: string;
  cacheKey?: string;
  params?: Params;
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
export interface AfterFnParams {
  params: Params;
  params2?: Params2;
  result: RequestResult;
  retry: () => Observable<any>;
}

export type AfterFn = (afterFnParams: AfterFnParams) => Promise<any>;
export type BeforeFn = (params: Params, params2?: Params2) => void;

export interface BaseHttpInterface {
  send: (
    method: HttpMethod,
    url: string,
    params: Params,
    headers?: Headers,
    withCredentials?: boolean,
    responseType?: XMLHttpRequestResponseType,
  ) => Observable<RequestResult>;
}
