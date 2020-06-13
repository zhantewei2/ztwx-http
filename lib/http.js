import { Observable, Subject, throwError } from "rxjs";
import { catchError, mergeMap, tap } from "rxjs/operators";
import { AllOneHttp } from "./base/all-one-http";
import { Cache } from "./cache";
var Http = /** @class */ (function () {
    function Http() {
        var _this = this;
        this.store = {};
        this.http = new AllOneHttp();
        this.hostUrl = "";
        this.appendTicketHeader = function (params2) {
            if (params2 === void 0) { params2 = {}; }
            if (_this.ticketKey && _this.ticketValue) {
                params2.headers = params2.headers || {};
                params2.headers[_this.ticketKey] = _this.ticketValue;
            }
            return params2;
        };
        this.httpSendBeforeHook = new Subject();
        this.httpReceiveHook = new Subject();
        this.httpReceiveErrorHook = new Subject();
        this.cacheXhr = function (params) { return _this.cache.cacheXhr(params); };
        this.xhr = function (method, relativeUrl, params, params2) {
            var url = (params2 && params2.root) || !_this.hostUrl
                ? relativeUrl
                : _this.hostUrl +
                    (relativeUrl.startsWith("/") ? relativeUrl : "/" + relativeUrl);
            var valueChangePostParams = {
                url: url,
                relativeUrl: relativeUrl,
                method: method,
                params: params,
                params2: params2,
            };
            _this.httpSendBeforeHook.next(valueChangePostParams);
            params2 = _this.appendTicketHeader(params2);
            _this.beforeFn && _this.beforeFn(params, params2);
            return _this.http
                .xhr({
                method: method,
                url: url,
                params: params,
                headers: (params2 || {}).headers,
                key: (params2 || {}).key,
            })
                .pipe(mergeMap(function (result) {
                return new Observable(function (ob) {
                    if (_this.afterFn) {
                        _this.afterFn({
                            params: params,
                            params2: params2,
                            result: result,
                            retry: _this.xhr(method, relativeUrl, params, params2),
                        })
                            .then(function (resultNext) {
                            ob.next(resultNext);
                            ob.complete();
                        })
                            .catch(function (err) {
                            ob.error(err);
                        });
                    }
                    else {
                        ob.next(result);
                        ob.complete();
                    }
                });
            }), catchError(function (err) {
                _this.httpReceiveErrorHook.next(Object.assign(valueChangePostParams, { result: err }));
                return throwError(err);
            }), tap(function (result) {
                _this.httpReceiveHook.next(Object.assign(valueChangePostParams, { result: result }));
            }));
        };
        this.cache = new Cache(this);
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
export { Http };
export var http = new Http();
