import { HttpInterface, HttpCacheXhr } from "../interface";
import { Observable } from "rxjs";

export type HttpAllParams = HttpCacheXhr;

export interface HttpVoyoRequest extends HttpAllParams {
  requestObserver?: Observable<any>;
}

export interface CompleteResultParams<T> {
  retry: () => Observable<any>;
  req: HttpVoyoRequest;
  result: T;
}
export type PreRequestReturn = Promise<
  HttpVoyoRequest | null | false | undefined
>;
export type PreRequestFn = (req: HttpVoyoRequest) => PreRequestReturn;

export interface CompleteResultFn<T> {
  (params: CompleteResultParams<T>): Promise<T>;
}

export type PipeHandleFn = (
  requestObserver: Observable<any>,
) => Observable<any>;

export interface HttpInterceptor {
  preRequest?: PreRequestFn;
  completeResult?: CompleteResultFn<any>;
  pipeHandle?: PipeHandleFn;
}

export interface HttpV2Interface extends HttpInterface {
  registryInterceptor(httpInterceptor: HttpInterceptor): void;
}
