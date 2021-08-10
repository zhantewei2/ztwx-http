import { __assign } from "tslib";
import { xhrAssemblyHeader, arrRunAsync, responseHeaderToDict, patchUnsubscribe, } from "../utils/utils";
import { Observable } from "rxjs";
var Ajax = /** @class */ (function () {
    function Ajax() {
    }
    /**
     * Making an Ajax request
     */
    Ajax.prototype.start = function (http) {
        return new Observable(function (ob) {
            var xhr = new XMLHttpRequest();
            var req = http.req, res = http.res, hooks = http.hooks;
            arrRunAsync([
                function (next) {
                    /**
                     * life Hook
                     * @preHandler
                     */
                    var preHandlerParams = { target: http, xhr: xhr, req: req };
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
                        xhr.timeout = req.timeout; // XHR timeout.
                    if (req.withCredentials)
                        xhr.withCredentials = req.withCredentials; // XHR withCredentials.
                    /**
                     * life Hook
                     * @postHandler
                     */
                    if (hooks.progressHandler)
                        xhr.onprogress = function (progressEvent) {
                            return hooks.progressHandler.call(http, {
                                progressEvent: progressEvent,
                                target: http,
                            });
                        };
                    next();
                },
                function (next) {
                    /**
                     * request complete
                     */
                    xhr.onreadystatechange = function (e) {
                        if (xhr.readyState !== 4 || xhr.status === 0)
                            return;
                        res.status = xhr.status;
                        res.result = xhr.response;
                        res.headers = responseHeaderToDict(xhr.getAllResponseHeaders());
                        next({});
                    };
                    xhr.addEventListener("abort", function (errorEvent) {
                        return next({ errorType: "abort", errorEvent: errorEvent });
                    });
                    xhr.addEventListener("error", function (errorEvent) {
                        return next({ errorType: "error", errorEvent: errorEvent });
                    });
                    xhr.addEventListener("timeout", function (errorEvent) {
                        return next({ errorType: "timeout", errorEvent: errorEvent });
                    });
                    patchUnsubscribe(ob, function () { return xhr.abort(); });
                    xhr.open(req.method, req.url);
                    /**
                     * Don't put line in front of `xhr.open` .. IE say.
                     */
                    if (req.responseType)
                        xhr.responseType = req.responseType; // XHR responseType.
                    /**
                     * config headers
                     */
                    if (req.headers)
                        xhrAssemblyHeader(xhr, req.headers); //Assembly http headers.
                    xhr.send(req.body);
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
    return Ajax;
}());
export { Ajax };
