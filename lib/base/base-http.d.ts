import { HttpMethod, Params, RequestResult, Headers } from "../interface";
import { Observable } from "rxjs";
export declare const queryStringify: (obj: any) => string;
export declare class BaseHttp {
    send(method: HttpMethod, url: string, params: Params, headers?: Headers): Observable<RequestResult>;
    assemblyHeader(xhr: XMLHttpRequest, headers: Headers): void;
    isUrlMethod(method: HttpMethod): boolean;
    isJsonMethod(method: HttpMethod): boolean;
    sendXhr(xhr: XMLHttpRequest, method: HttpMethod, url: string, params: Params, headers?: Headers): void;
}
