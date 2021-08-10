import { Tapable, TapableAsync, TapableInline } from "../utils/tapable";
import { mergeMap } from "rxjs/operators";
import { fromPromise } from "rxjs/internal-compatibility";
var HttpPluginHandlers = /** @class */ (function () {
    function HttpPluginHandlers() {
        this.preHandler = new Tapable();
        this.preHandlerAsync = new TapableAsync();
        this.progressHandler = new Tapable();
        this.afterCompletion = new Tapable();
        this.afterCompletionAsync = new TapableAsync();
        this.errorTrigger = new Tapable();
    }
    return HttpPluginHandlers;
}());
export { HttpPluginHandlers };
var VoyoHttpPluginManager = /** @class */ (function () {
    function VoyoHttpPluginManager() {
        this.httpPluginHandlers = new HttpPluginHandlers();
        this.pluginList = [];
        this.beforeHandlerAsync = new TapableAsync();
        this.afterHandlerAsync = new TapableAsync();
        this.wrapperHandler = new TapableInline();
    }
    VoyoHttpPluginManager.prototype.addPlugin = function (plugin) {
        if (!this.pluginList.find(function (i) { return i.name === plugin.name; }))
            this.pluginList.push(plugin);
    };
    VoyoHttpPluginManager.prototype.removePlugin = function (name) {
        var existsIndex = this.pluginList.findIndex(function (i) { return i.name === name; });
        existsIndex !== undefined && this.pluginList.splice(existsIndex, 1);
    };
    VoyoHttpPluginManager.prototype.initPlugin = function () {
        var _this = this;
        this.pluginList.sort(function (pre, next) { return next.priority - pre.priority; });
        this.pluginList.forEach(function (plugin) {
            plugin.before &&
                _this.beforeHandlerAsync.tapAsync(function (p) { return plugin.before(p); });
            plugin.after &&
                _this.afterHandlerAsync.tapAsync(function (p) {
                    return plugin.after(p.after, p.before);
                });
            plugin.registryHooks &&
                plugin.registryHooks({ httpPluginHandlers: _this.httpPluginHandlers });
            if (plugin.wrapper) {
                _this.wrapperHandler.tap(function (p) { return ({
                    http: p.http,
                    httpObserver: plugin.wrapper(p),
                }); });
            }
            plugin.patchCall && plugin.patchCall(_this);
        });
    };
    VoyoHttpPluginManager.prototype.wrapperHttp = function (http, httpParams, send) {
        var _this = this;
        http.hooks.preHandler = function (p) { return _this.httpPluginHandlers.preHandler.run(p); };
        http.hooks.preHandlerAsync = function (p) {
            return _this.httpPluginHandlers.preHandlerAsync.run(p);
        };
        http.hooks.progressHandler = function (p) {
            return _this.httpPluginHandlers.progressHandler.run(p);
        };
        http.hooks.afterCompletion = function (p) {
            return _this.httpPluginHandlers.afterCompletion.run(p);
        };
        http.hooks.afterCompletionAsync = function (p) {
            return _this.httpPluginHandlers.afterCompletionAsync.run(p);
        };
        http.hooks.errorTrigger = function (p) {
            return _this.httpPluginHandlers.errorTrigger.run(p);
        };
        Object.freeze(http.hooks);
        var beforeParams = { http: http, httpParams: httpParams };
        return fromPromise(this.beforeHandlerAsync.run(beforeParams, true)).pipe(mergeMap(function (md) {
            var httpObserver = (md || send()).pipe(mergeMap(function (httpResult) {
                return fromPromise(_this.afterHandlerAsync
                    .run({ after: httpResult, before: beforeParams })
                    .then(function () { return httpResult; }));
            }));
            return _this.wrapperHandler.runInline({ http: http, httpObserver: httpObserver })
                .httpObserver;
        }));
    };
    return VoyoHttpPluginManager;
}());
export { VoyoHttpPluginManager };
