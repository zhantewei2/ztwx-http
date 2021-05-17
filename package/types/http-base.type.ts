import { Observable } from "rxjs";
import { HttpSuccessResult } from "./http-params.type";

export type HttpMethod = "get" | "post" | "delete" | "update" | "put";
export type UniMethod =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "connect"
  | "head"
  | "options"
  | "trace";

export type HttpHeaders = Record<
  string,
  boolean | string | undefined | number | null
>;
type JsonParams = Record<string, any>;
type QueryParams = Record<string, any>;
type HttpCommonErrorType = "abort" | "error" | "timeout" | string;
type HttpCommonError = {
  errorType: HttpCommonErrorType;
  errorEvent: Event;
};
type HttpCommonErrorEvent = Event | any;

export {
  JsonParams,
  QueryParams,
  HttpCommonErrorType,
  HttpCommonError,
  HttpCommonErrorEvent,
};
