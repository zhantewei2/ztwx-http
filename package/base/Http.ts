import { Request } from "./Request";
import { Response } from "./Response";
import {
  HttpCommonErrorType,
  HttpCommonError,
  HttpCommonErrorEvent,
} from "../types/http-base.type";
import { Observable } from "rxjs";
import { HttpSuccessResult } from "../types/http-params.type";

export interface BaseParams {
  target: Http;
}

export interface PreHandlerParams extends BaseParams {
  xhr?: XMLHttpRequest;
  req: Request;
}

export interface PostHandlerParams extends BaseParams {
  progressEvent?: ProgressEvent;
}
export interface AfterCompletionParams extends BaseParams {
  req: Request;
  res: Response;
  errorType: HttpCommonErrorType;
  errorEvent: Event;
}

export type ErrorHandlerParams = BaseParams & HttpCommonError;

export interface HttpHooks {
  preHandler?: (params: PreHandlerParams) => void;
  preHandlerAsync?: (params: PreHandlerParams) => Promise<void>;
  progressHandler?: (params: PostHandlerParams) => void;
  afterCompletion?: (params: AfterCompletionParams) => void;
  afterCompletionAsync?: (params: AfterCompletionParams) => Promise<void>;
  errorTrigger?: (params: ErrorHandlerParams) => void;
}

export class Http {
  req: Request;
  res: Response;
  hooks: HttpHooks = {};
  errorType: HttpCommonErrorType;
  errorEvent: HttpCommonErrorEvent;
  constructor() {
    this.req = new Request();
    this.res = new Response();
  }
}
export interface HttpTransmitter {
  start(http: Http): Observable<HttpSuccessResult>;
}
