export declare type HttpMethod = "get" | "post" | "delete" | "update" | "put";
export declare type UniMethod = "get" | "post" | "put" | "delete" | "connect" | "head" | "options" | "trace";
export declare type HttpHeaders = Record<string, boolean | string | undefined | number | null>;
declare type JsonParams = Record<string, any>;
declare type QueryParams = Record<string, any>;
declare type HttpCommonErrorType = "abort" | "error" | "timeout" | string;
declare type HttpCommonError = {
    errorType: HttpCommonErrorType;
    errorEvent: Event;
};
declare type HttpCommonErrorEvent = Event | any;
export { JsonParams, QueryParams, HttpCommonErrorType, HttpCommonError, HttpCommonErrorEvent, };
