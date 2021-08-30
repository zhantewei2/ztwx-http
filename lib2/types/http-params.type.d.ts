import { HttpMethod } from "./http-base.type";
import { Http } from "../base/Http";
import { Observable } from "rxjs";
export interface HttpParams {
    method: HttpMethod;
    url?: string;
}
export interface HttpSuccessResult {
    http: Http;
}
export declare type XhrSend = (params: HttpParams) => Observable<HttpSuccessResult>;
export declare type HttpErrorResult = any;
