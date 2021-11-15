import { arrForEachAsync } from "./utils";
var Tapable = /** @class */ (function () {
    function Tapable() {
    }
    Tapable.prototype.tap = function (run, priority) {
        this.list = this.list || [];
        this.list.push({ run: run, priority: priority });
        this.list.sort(function (pre, next) { return next.priority - pre.priority; });
    };
    Tapable.prototype.run = function (p) {
        this.list && this.list.forEach(function (i) { return i.run(p); });
    };
    return Tapable;
}());
export { Tapable };
var TapableInline = /** @class */ (function () {
    function TapableInline() {
    }
    TapableInline.prototype.tap = function (run, priority) {
        this.list = this.list || [];
        this.list.push({ run: run, priority: priority });
        this.list.sort(function (pre, next) { return next.priority - pre.priority; });
    };
    TapableInline.prototype.runInline = function (p) {
        if (!this.list)
            return p;
        for (var _i = 0, _a = this.list; _i < _a.length; _i++) {
            var i = _a[_i];
            p = i.run(p);
        }
        return p;
    };
    return TapableInline;
}());
export { TapableInline };
var TapableAsync = /** @class */ (function () {
    function TapableAsync() {
    }
    TapableAsync.prototype.tapAsync = function (callback, priority) {
        this.list = this.list || [];
        this.list.push({ run: callback, priority: priority });
        this.list.sort(function (pre, next) { return next.priority - pre.priority; });
    };
    /**
     * prevent next when @return false
     * @param p
     * @param mdBreak  break async if mdBreak exit
     */
    TapableAsync.prototype.run = function (p, mdBreak) {
        var _this = this;
        return !this.list
            ? Promise.resolve(undefined)
            : new Promise(function (resolve, reject) {
                return arrForEachAsync(_this.list.map(function (i) { return function (next) {
                    return i
                        .run(p)
                        .then(function (md) { return (md && mdBreak ? resolve(md) : next()); })
                        .catch(reject);
                }; }), function () { return resolve(undefined); });
            });
    };
    return TapableAsync;
}());
export { TapableAsync };
