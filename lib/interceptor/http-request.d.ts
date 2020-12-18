import { Observable } from "rxjs";
import { HttpAllParams, HttpVoyoRequest } from "./interceptor.interface";
import { HttpMethod, Params, Params2 } from "../interface";
export declare class HttpVoyoRequestEntity implements HttpVoyoRequest {
    method: HttpMethod;
    relativeUrl: string;
    cacheKey?: string;
    params?: Params;
    params2?: Params2;
    expires?: number;
    destroyOnXhr?: Array<string | RegExp>;
    requestObserver?: Observable<any>;
    constructor(params: HttpAllParams);
}
