import { HttpMethod, Params, Headers, RequestResult, HttpRequestLib, BaseHttpInterface } from "../interface";
import { Observable } from "rxjs";
import { BaseCapacity } from "./base";
export interface AllOneSendOpts {
    method: HttpMethod;
    url: string;
    params: Params;
    headers?: Headers;
    key?: string;
    withCredentials?: boolean;
}
export declare class AllOneHttp extends BaseCapacity {
    baseHttp: BaseHttpInterface;
    constructor(requestLib: HttpRequestLib);
    /***
     * generate unique key
     * @param key
     * @param method
     * @param url
     * @param params
     */
    generateKey(key: string | undefined, method: HttpMethod, url: string, params: Params): string;
    xhr: ({ method, url, params, headers, key, withCredentials, }: AllOneSendOpts) => Observable<RequestResult>;
}
