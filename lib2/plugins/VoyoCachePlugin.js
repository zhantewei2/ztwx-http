export { LimitStore } from "./limitStore";
import { LimitStore } from "./limitStore";
import { of } from "rxjs";
var VoyoCachePlugin = /** @class */ (function () {
    function VoyoCachePlugin(_a) {
        var maxCount = _a.maxCount, controllerCount = _a.controllerCount, defaultExpireSeconds = _a.defaultExpireSeconds, shouldCache = _a.shouldCache;
        this.name = "voyo-cache-plugin";
        this.priority = 99;
        this.defaultExpireSeconds = defaultExpireSeconds || 0;
        this.limitStore = new LimitStore(maxCount, controllerCount);
        this.shouldCache = shouldCache;
    }
    VoyoCachePlugin.prototype.getNowDate = function () {
        return Math.round(Date.now() / 1000);
    };
    VoyoCachePlugin.prototype.isExpire = function (key, expireDate) {
        if (expireDate === 0)
            return false;
        if (expireDate < this.getNowDate()) {
            this.limitStore.del(key);
            return true;
        }
        return false;
    };
    VoyoCachePlugin.prototype.before = function (_a) {
        var http = _a.http, cacheOpts = _a.httpParams.cacheOpts;
        if (cacheOpts && cacheOpts.key) {
            var info = this.limitStore.get(cacheOpts.key);
            if (info) {
                if (!this.isExpire(cacheOpts.key, info.expireDate)) {
                    Object.assign(http.res, info.http.res);
                    Object.assign(http.req, info.http.req);
                    return Promise.resolve(of({ http: http }));
                }
            }
        }
        return Promise.resolve();
    };
    VoyoCachePlugin.prototype.after = function (result, _a) {
        var cacheOpts = _a.httpParams.cacheOpts, http = _a.http;
        if (!cacheOpts)
            return Promise.resolve();
        if ((this.shouldCache && !this.shouldCache(result)) ||
            (cacheOpts.shouldCache && !cacheOpts.shouldCache(result)))
            return Promise.resolve();
        this.limitStore.add(cacheOpts.key, {
            expireDate: cacheOpts.expireSeconds == null
                ? this.defaultExpireSeconds
                : this.getNowDate() + cacheOpts.expireSeconds,
            http: {
                req: http.req,
                res: http.res,
            },
        });
        return Promise.resolve();
    };
    return VoyoCachePlugin;
}());
export { VoyoCachePlugin };
