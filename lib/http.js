define(["require", "exports", "tslib", "rxjs", "rxjs/operators", "./cache"], function (require, exports, tslib_1, rxjs_1, operators_1, cache_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CacheHttp = require("cache-ajax").CacheHttp;
    var Http = /** @class */ (function () {
        function Http() {
            var _this = this;
            this.store = {};
            this.appendTicketHeader = function (params2) {
                var _a, _b;
                if (params2 === void 0) { params2 = {}; }
                if (_this.ticketKey && _this.ticketValue) {
                    params2.headers = params2.headers ? tslib_1.__assign(tslib_1.__assign({}, params2.headers), (_a = {}, _a[_this.ticketKey] = _this.ticketValue, _a)) : (_b = {}, _b[_this.ticketKey] = _this.ticketValue, _b);
                }
                return params2;
            };
            this.httpSendBeforeHook = new rxjs_1.Subject();
            this.httpReceiveHook = new rxjs_1.Subject();
            this.httpReceiveErrorHook = new rxjs_1.Subject();
            this.cacheXhr = function (params) { return _this.cache.cacheXhr(params); };
            this.xhr = function (method, relativeUrl, params, params2) {
                var url = _this.hostUrl + (relativeUrl.startsWith("/") ? relativeUrl : "/" + relativeUrl);
                var valueChangePostParams = {
                    url: url,
                    relativeUrl: relativeUrl,
                    method: method,
                    params: params,
                    params2: params2
                };
                _this.httpSendBeforeHook.next(valueChangePostParams);
                return _this.cacheHttp.xhr(method, url, params, _this.appendTicketHeader(params2)).pipe(operators_1.catchError(function (err) {
                    _this.httpReceiveErrorHook.next(Object.assign(valueChangePostParams, { result: err }));
                    return rxjs_1.throwError(err);
                }), operators_1.tap(function (result) {
                    _this.httpReceiveHook.next(Object.assign(valueChangePostParams, { result: result }));
                }));
            };
            this.cacheHttp = new CacheHttp({}, function (params) { return _this.beforeFn ? _this.beforeFn(params) : params; }, function (result, retryFn) { return _this.afterFn ? _this.afterFn(result, retryFn) : Promise.resolve(result); });
            this.cache = new cache_1.Cache(this);
        }
        Http.prototype.setBeforeHandler = function (fn) {
            this.beforeFn = fn;
        };
        Http.prototype.setAfterHandler = function (fn) {
            this.afterFn = fn;
        };
        Http.prototype.setHost = function (host) {
            this.hostUrl = host;
        };
        Http.prototype.setTicketKey = function (key) {
            this.ticketKey = key;
        };
        Http.prototype.setTicketValue = function (v) {
            this.ticketValue = v;
        };
        return Http;
    }());
    exports.Http = Http;
    exports.http = new Http();
});
