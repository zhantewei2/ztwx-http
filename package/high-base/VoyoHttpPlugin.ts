import {
  HttpParams,
  HttpSuccessResult,
  XhrSend,
} from "../types/http-params.type";
import {
  AfterCompletionParams,
  ErrorHandlerParams,
  Http,
  HttpHooks,
  PostHandlerParams,
  PreHandlerParams,
} from "../base/Http";
import { from, Observable } from "rxjs";
import { Tapable, TapableAsync, TapableInline } from "../utils/tapable";
import { map, mergeMap } from "rxjs/operators";
import { fromPromise } from "rxjs/internal-compatibility";

export class HttpPluginHandlers {
  preHandler: Tapable<PreHandlerParams> = new Tapable<PreHandlerParams>();
  preHandlerAsync: TapableAsync<PreHandlerParams> =
    new TapableAsync<PreHandlerParams>();
  progressHandler: Tapable<PostHandlerParams> =
    new Tapable<PostHandlerParams>();
  afterCompletion: Tapable<AfterCompletionParams> =
    new Tapable<AfterCompletionParams>();
  afterCompletionAsync: TapableAsync<AfterCompletionParams> =
    new TapableAsync<AfterCompletionParams>();
  errorTrigger: Tapable<ErrorHandlerParams> = new Tapable<ErrorHandlerParams>();
}
export interface HttpApplyParams {
  httpPluginHandlers: HttpPluginHandlers;
}
export interface HttpBeforeParams {
  httpParams: HttpParams;
  http: Http;
}
export type HttpAfterParams = HttpSuccessResult;
export type HttpAfterAllParams = {
  after: HttpAfterParams;
  before: HttpBeforeParams;
};
export interface HttpWrapperParams {
  http: Http;
  httpObserver: Observable<HttpSuccessResult>;
}

export type BeForeBreakInfo = Observable<HttpSuccessResult>;

export interface VoyoHttpPlugin {
  priority: number; //sort order
  name: string;
  patchCall?(self: any): void;
  before?(params: HttpBeforeParams): Promise<void | BeForeBreakInfo>; // Http hook.
  registryHooks?(params: HttpApplyParams): void; // Http basic life hooks.
  after?(
    params: HttpAfterParams,
    beforeParams?: HttpBeforeParams,
  ): Promise<void>; // Http hook
  wrapper?(params: HttpWrapperParams): Observable<HttpSuccessResult>; // Observer hook;
}

export class VoyoHttpPluginManager {
  httpPluginHandlers: HttpPluginHandlers = new HttpPluginHandlers();
  pluginList: Array<VoyoHttpPlugin> = [];
  beforeHandlerAsync = new TapableAsync<HttpBeforeParams>();
  afterHandlerAsync = new TapableAsync<HttpAfterAllParams>();
  wrapperHandler = new TapableInline<HttpWrapperParams>();

  addPlugin(plugin: VoyoHttpPlugin) {
    if (!this.pluginList.find((i) => i.name === plugin.name))
      this.pluginList.push(plugin);
  }
  addPluginDynamic(plugin: VoyoHttpPlugin) {
    this.pluginList.push(plugin);
    this.flatPlugin(plugin);
  }
  removePlugin(name: string) {
    const existsIndex = this.pluginList.findIndex((i) => i.name === name);
    existsIndex !== undefined && this.pluginList.splice(existsIndex, 1);
  }
  flatPlugin(plugin: VoyoHttpPlugin) {
    plugin.before &&
      this.beforeHandlerAsync.tapAsync(
        (p) => (plugin as any).before(p),
        plugin.priority,
      );
    plugin.after &&
      this.afterHandlerAsync.tapAsync(
        (p: HttpAfterAllParams) => (plugin as any).after(p.after, p.before),
        plugin.priority,
      );
    plugin.registryHooks &&
      plugin.registryHooks({ httpPluginHandlers: this.httpPluginHandlers });

    if (plugin.wrapper) {
      this.wrapperHandler.tap(
        (p) => ({
          http: p.http,
          httpObserver: (plugin as any).wrapper(p),
        }),
        plugin.priority,
      );
    }
    plugin.patchCall && plugin.patchCall(this);
  }

  initPlugin() {
    this.pluginList
      .sort((pre, next) => next.priority - pre.priority)
      .forEach((plugin) => this.flatPlugin(plugin));
  }
  wrapperHttp(
    http: Http,
    httpParams: HttpParams,
    send: () => Observable<HttpSuccessResult>,
  ): Observable<HttpSuccessResult> {
    http.hooks.preHandler = (p) => this.httpPluginHandlers.preHandler.run(p);
    http.hooks.preHandlerAsync = (p) =>
      this.httpPluginHandlers.preHandlerAsync.run(p);
    http.hooks.progressHandler = (p) =>
      this.httpPluginHandlers.progressHandler.run(p);
    http.hooks.afterCompletion = (p) =>
      this.httpPluginHandlers.afterCompletion.run(p);
    http.hooks.afterCompletionAsync = (p) =>
      this.httpPluginHandlers.afterCompletionAsync.run(p);
    http.hooks.errorTrigger = (p) =>
      this.httpPluginHandlers.errorTrigger.run(p);
    Object.freeze(http.hooks);

    const beforeParams = { http, httpParams };
    return fromPromise(this.beforeHandlerAsync.run(beforeParams, true)).pipe(
      mergeMap((md: Observable<HttpSuccessResult> | void) => {
        const httpObserver = (md || send()).pipe(
          mergeMap((httpResult) =>
            fromPromise(
              this.afterHandlerAsync
                .run({ after: httpResult, before: beforeParams })
                .then(() => httpResult),
            ),
          ),
        );
        return this.wrapperHandler.runInline({ http, httpObserver })
          .httpObserver;
      }),
    );
  }
}
