import { HttpHeaders, HttpMethod } from "../types/http-base.type";
export declare class Request {
    method: HttpMethod;
    url: string;
    body?: BodyInit;
    responseType: XMLHttpRequestResponseType;
    timeout: number;
    headers: HttpHeaders;
    withCredentials?: boolean;
    xhr?: XMLHttpRequest;
    voyoInfo?: any;
    mergeInfo?: any;
    requestParams?: Record<string, any>;
}
