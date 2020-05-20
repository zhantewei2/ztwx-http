import { Observable, Subject, Subscription } from "rxjs";

export type HttpMethod =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "update"
  | "postForm"
  | "postStream";

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
export type Params = Record<string, any> | any;
export type Headers = Record<string, string>;

export interface Params2 {
  headers?: { [key: string]: any };
  expires?: number;
  key?: string;
  root?: string;
}

export interface HttpInterface {
  setBeforeHandler: any;
  setAfterHandler: (fn: AfterFn) => void;
  setTicketKey: (v: string) => void;
  setTicketValue: (v: string) => void;
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
  retry: Observable<any>;
}

export type AfterFn = (afterFnParams: AfterFnParams) => Promise<any>;
export type BeforeFn = (params: Params, params2?: Params2) => void;
