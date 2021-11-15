import { HttpParams, HttpSuccessResult } from "../types/http-params.type";
import { AfterCompletionParams, ErrorHandlerParams, Http, PostHandlerParams, PreHandlerParams } from "../base/Http";
import { Observable } from "rxjs";
import { Tapable, TapableAsync, TapableInline } from "../utils/tapable";
export declare class HttpPluginHandlers {
    preHandler: Tapable<PreHandlerParams>;
    preHandlerAsync: TapableAsync<PreHandlerParams>;
    progressHandler: Tapable<PostHandlerParams>;
    afterCompletion: Tapable<AfterCompletionParams>;
    afterCompletionAsync: TapableAsync<AfterCompletionParams>;
    errorTrigger: Tapable<ErrorHandlerParams>;
}
export interface HttpApplyParams {
    httpPluginHandlers: HttpPluginHandlers;
}
export interface HttpBeforeParams {
    httpParams: HttpParams;
    http: Http;
}
export declare type HttpAfterParams = HttpSuccessResult;
export declare type HttpAfterAllParams = {
    after: HttpAfterParams;
    before: HttpBeforeParams;
};
export interface HttpWrapperParams {
    http: Http;
    httpObserver: Observable<HttpSuccessResult>;
}
export declare type BeForeBreakInfo = Observable<HttpSuccessResult>;
export interface VoyoHttpPlugin {
    priority: number;
    name: string;
    patchCall?(self: any): void;
    before?(params: HttpBeforeParams): Promise<void | BeForeBreakInfo>;
    registryHooks?(params: HttpApplyParams): void;
    after?(params: HttpAfterParams, beforeParams?: HttpBeforeParams): Promise<void>;
    wrapper?(params: HttpWrapperParams): Observable<HttpSuccessResult>;
}
export declare class VoyoHttpPluginManager {
    httpPluginHandlers: HttpPluginHandlers;
    pluginList: Array<VoyoHttpPlugin>;
    beforeHandlerAsync: TapableAsync<HttpBeforeParams>;
    afterHandlerAsync: TapableAsync<HttpAfterAllParams>;
    wrapperHandler: TapableInline<HttpWrapperParams>;
    addPlugin(plugin: VoyoHttpPlugin): void;
    addPluginDynamic(plugin: VoyoHttpPlugin): void;
    removePlugin(name: string): void;
    flatPlugin(plugin: VoyoHttpPlugin): void;
    initPlugin(): void;
    wrapperHttp(http: Http, httpParams: HttpParams, send: () => Observable<HttpSuccessResult>): Observable<HttpSuccessResult>;
}
