import { HttpMethod, Params, RequestResult, Headers, BaseHttpInterface, HttpRequestLib } from "../interface";
import { Observable } from "rxjs";
import { BaseCapacity } from "./base";
import { BaseHttpUniapp } from "./base-http-uniapp";
export declare const queryStringify: (obj: Params) => string;
export declare class BaseHttpXhr extends BaseCapacity implements BaseHttpInterface {
    xhr: XMLHttpRequest;
    send(method: HttpMethod, url: string, params: Params, headers?: Headers, withCredentials?: boolean, responseType?: XMLHttpRequestResponseType): Observable<RequestResult>;
    private sendXhr;
    private setXhr;
    getResponseHeader(key: string): string | null;
}
export declare const BaseHttp: typeof BaseHttpUniapp | typeof BaseHttpXhr;
export declare const getBaseHttp: (requestLib: HttpRequestLib) => any;
