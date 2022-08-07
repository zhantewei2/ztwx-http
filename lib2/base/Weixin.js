import { __assign } from "tslib";
import { arrRunAsync } from "../utils/utils";
import { Observable } from "rxjs";
var Weixin = /** @class */ (function () {
    function Weixin(tool) {
        if (tool === void 0) { tool = wx; }
        this.tool = tool;
    }
    /**
     * Making an Ajax request
     */
    Weixin.prototype.start = function (http) {
        var _this = this;
        return new Observable(function (ob) {
            var req = http.req, res = http.res, hooks = http.hooks;
            var requestParams = {};
            arrRunAsync([
                function (next) {
                    /**
                     * life Hook
                     * @preHandler
                     */
                    var preHandlerParams = { target: http, req: req };
                    hooks.preHandler && hooks.preHandler.call(http, preHandlerParams);
                    hooks.preHandlerAsync
                        ? hooks.preHandlerAsync.call(http, preHandlerParams).then(next)
                        : next();
                },
                function (next) {
                    /**
                     * config
                     */
                    if (req.timeout)
                        requestParams.timeout = req.timeout; // XHR timeout.
                    if (req.responseType) {
                        // XHR responseType.
                        if (req.responseType === "json") {
                            requestParams.responseType = "text";
                            requestParams.dataType = "json";
                        }
                        else if (req.responseType === "text") {
                            requestParams.responseType = "text";
                            requestParams.dataType = undefined;
                        }
                        else {
                            requestParams.responseType = "arraybuffer";
                            requestParams.dataType = undefined;
                        }
                    }
                    /**
                     * life Hook
                     * @postHandler
                     */
                    //progress not work!
                    next();
                },
                function (next) {
                    /**
                     * request complete
                     */
                    var task = _this.tool.request(__assign(__assign({}, requestParams), { method: req.method, url: req.url, header: req.headers || {}, data: req.body, success: function (result) {
                            res.status = result.statusCode;
                            res.result = result.data;
                            res.headers = result.header;
                            next({});
                        }, fail: function (e) {
                            var errorType = e.errMsg.indexOf("timeout") >= 0
                                ? "timeout"
                                : e.errMsg.indexOf("abort") >= 0
                                    ? "abort"
                                    : "error";
                            next({
                                errorType: errorType,
                                errorEvent: e,
                            });
                        } }));
                },
                function (next, error) {
                    /**
                     * life Hook
                     * @afterCompletion
                     */
                    var afterCompletionParams = __assign({ target: http, res: res, req: req }, error);
                    http.errorEvent = error.errorEvent;
                    http.errorType = error.errorType;
                    hooks.afterCompletion &&
                        hooks.afterCompletion.call(http, afterCompletionParams);
                    hooks.afterCompletionAsync
                        ? hooks.afterCompletionAsync
                            .call(http, afterCompletionParams)
                            .then(next)
                        : next();
                },
                function (next) {
                    if (http.errorType) {
                        /**
                         * life Hook
                         * @errorTrigger
                         */
                        hooks.errorTrigger &&
                            hooks.errorTrigger({
                                errorType: http.errorType,
                                errorEvent: http.errorEvent,
                                target: http,
                            });
                        ob.error({ http: http });
                    }
                    else {
                        ob.next({ http: http });
                    }
                    ob.complete();
                },
            ]);
        });
    };
    return Weixin;
}());
export { Weixin };
