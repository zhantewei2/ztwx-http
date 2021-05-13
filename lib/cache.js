import { Store } from "./store";
import { of, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
var Cache = /** @class */ (function () {
    function Cache(http) {
        this.cacheExpireTag = "ztwx-http-cache-expire-tag";
        this.cacheDestroyDict = new Store();
        this.http = http;
    }
    Cache.prototype.cacheXhr = function (_a) {
        var _this = this;
        var method = _a.method, expires = _a.expires, relativeUrl = _a.relativeUrl, params = _a.params, params2 = _a.params2, destroyOnXhr = _a.destroyOnXhr;
        if (!expires) {
            return this.http.xhr(method, relativeUrl, params, params2);
        }
        var key = (params2 || {}).key ||
            method + "-" + relativeUrl + "-" + JSON.stringify(params);
        var existsCacheDestroyDict = this.cacheDestroyDict.getValue(key);
        if (existsCacheDestroyDict) {
            /**
             * is loading
             */
            if (existsCacheDestroyDict.xhrLoad) {
                return existsCacheDestroyDict.xhrLoad;
            }
            else {
                var resultValue = existsCacheDestroyDict.cacheValue;
                if (resultValue !== undefined && resultValue != this.cacheExpireTag) {
                    if (typeof resultValue === "string" && resultValue.includes("err:")) {
                        throwError(resultValue.split("err:")[1]);
                    }
                    return of(resultValue);
                }
            }
        }
        var cacheDestroy = {
            key: key,
            cacheValue: "",
        };
        this.cacheExpiredJsonForCacheValue(cacheDestroy, expires);
        if (destroyOnXhr) {
            cacheDestroy["matchedDestroyFn"] = this.matchedDestroyFnFactory(destroyOnXhr);
            cacheDestroy["subscription"] = this.http.httpReceiveHook.subscribe(function (_a) {
                var result = _a.result, relativeUrl = _a.relativeUrl;
                if (cacheDestroy.matchedDestroyFn(relativeUrl)) {
                    _this.removeCacheDestroy(key);
                }
            });
        }
        this.cacheDestroyDict.setValue(key, cacheDestroy);
        cacheDestroy.xhrLoad = new Subject();
        return this.http.xhr(method, relativeUrl, params, params2).pipe(tap(function (result) {
            var _a;
            cacheDestroy.cacheValue = result;
            (_a = cacheDestroy.xhrLoad) === null || _a === void 0 ? void 0 : _a.next(result);
            cacheDestroy.xhrLoad = undefined;
        }), catchError(function (err) {
            var _a;
            cacheDestroy.cacheValue = "err:" + err;
            (_a = cacheDestroy.xhrLoad) === null || _a === void 0 ? void 0 : _a.next("err:" + err);
            cacheDestroy.xhrLoad = undefined;
            throw err;
        }));
    };
    Cache.prototype.cacheExpiredJsonForCacheValue = function (cacheDestroy, expires) {
        var _cacheValue = "";
        var setTime = 0;
        var self = this;
        Object.defineProperty(cacheDestroy, "cacheValue", {
            get: function () {
                if (new Date().getTime() > setTime) {
                    self.removeCacheDestroy(cacheDestroy.key);
                    return self.cacheExpireTag;
                }
                return JSON.parse(_cacheValue);
            },
            set: function (v) {
                setTime = new Date().getTime() + expires;
                _cacheValue = JSON.stringify(v);
            },
        });
    };
    Cache.prototype.removeCacheDestroy = function (key) {
        var cacheDestroy = this.cacheDestroyDict.getValue(key);
        if (!cacheDestroy)
            return;
        cacheDestroy.subscription && cacheDestroy.subscription.unsubscribe();
        this.cacheDestroyDict.deleteKey(key);
    };
    Cache.prototype.matchedDestroyFnFactory = function (matchedList) {
        var fn = function (url) {
            return false;
        };
        matchedList.forEach(function (i) {
            var oldFn = fn;
            if (i instanceof RegExp) {
                fn = function (url) {
                    if (oldFn(url))
                        return true;
                    return i.test(url);
                };
            }
            else {
                fn = function (url) {
                    if (oldFn(url))
                        return true;
                    return i === url;
                };
            }
        });
        return fn;
    };
    return Cache;
}());
export { Cache };
