import { HttpApplyParams, HttpBeforeParams, HttpWrapperParams, VoyoHttpPlugin } from "../high-base/VoyoHttpPlugin";
import { HttpHeaders } from "../types/http-base.type";
import { HighHttp } from "../high-base/HighHttp";
import { PriorityHeaderRecord, PriorityHeaders } from "./PriorityHeaders";
import { HttpParams, HttpSuccessResult } from "../types/http-params.type";
import { Request } from "../base/Request";
import { Observable } from "rxjs";
export declare type HttpResult = BodyInit | Record<string, any>;
declare module "../types/http-params.type" {
    interface HttpParams {
        path?: string;
        headers?: HttpHeaders;
        priorityHeaders?: PriorityHeaderRecord;
        queryURIEncode?: boolean;
        query?: Record<string, any>;
        json?: Record<string, any>;
        arrayBuffer?: ArrayBuffer;
        blob?: Blob;
        formData?: FormData;
        body?: BodyInit;
        responseType?: XMLHttpRequestResponseType;
        withCredentials?: boolean;
        noAutoHeader?: boolean;
    }
    interface HttpSuccessResult {
        result?: HttpResult;
        statusCode?: number;
    }
}
declare module "../high-base/HighHttp" {
    interface HighHttp {
        setHost(v: string): void;
        setGlobalHeader(k: string, v: any, priority?: number): void;
        setWithCredentials(v: boolean): void;
    }
}
export declare class VoyoBasePlugin implements VoyoHttpPlugin {
    name: string;
    priority: number;
    hostAddress: string;
    globalPriorityHeaders: PriorityHeaders;
    withCredentials: boolean;
    defaultContentType: string;
    defaultResponseType: XMLHttpRequestResponseType;
    /**
     * @override
     * @param highHttp
     */
    patchCall(highHttp: HighHttp): void;
    defineResponseType(httpParams: HttpParams, req: Request): void;
    defineRequestUrl(httpParams: HttpParams, req: Request): void;
    /**
     * @override
     * @param http
     * @param httpParams
     */
    before({ http, httpParams }: HttpBeforeParams): Promise<void>;
    /**
     * @override
     * @param httpPluginHandlers
     */
    registryHooks({ httpPluginHandlers }: HttpApplyParams): void;
    /**
     * @override
     * @param httpObserver
     */
    wrapper({ httpObserver }: HttpWrapperParams): Observable<HttpSuccessResult>;
}
