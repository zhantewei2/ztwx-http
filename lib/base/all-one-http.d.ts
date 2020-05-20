import { BaseHttp } from "./base-http";
import { HttpMethod, Params, Headers, RequestResult } from "../interface";
import { Observable } from "rxjs";
export interface AllOneSendOpts {
    method: HttpMethod;
    url: string;
    params: Params;
    headers?: Headers;
    key?: string;
}
export declare class AllOneHttp extends BaseHttp {
    /***
     * generate unique key
     * @param key
     * @param method
     * @param url
     * @param params
     */
    generateKey(key: string | undefined, method: HttpMethod, url: string, params: Params): string;
    xhr: ({ method, url, params, headers, key, }: AllOneSendOpts) => Observable<RequestResult>;
}
