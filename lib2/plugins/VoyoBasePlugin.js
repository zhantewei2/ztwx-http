import { queryparams } from "@ztwx/utils/lib/url";
import { joinUrl, nullishCoalescing } from "../utils/utils";
import { PriorityHeaders } from "./PriorityHeaders";
var VoyoBasePlugin = /** @class */ (function () {
    function VoyoBasePlugin() {
        this.name = "voyo-base-plugin";
        this.priority = 100;
        this.globalPriorityHeaders = new PriorityHeaders({});
        this.withCredentials = true;
        this.defaultContentType = "application/json";
        this.defaultResponseType = "json";
        /**
         * @override
         * @param httpObserver
         */
        // wrapper({ httpObserver }: HttpWrapperParams): Observable<HttpSuccessResult> {
        //   return httpObserver.pipe(
        //     map((httpSuccessResult) => {
        //       const res = httpSuccessResult.http.res;
        //       httpSuccessResult.statusCode = res.status;
        //       httpSuccessResult.result = res.result;
        //       return httpSuccessResult;
        //     }),
        //   );
        // }
    }
    /**
     * @override
     * @param highHttp
     */
    VoyoBasePlugin.prototype.patchCall = function (highHttp) {
        var _this = this;
        highHttp.setHost = function (hostAddress) {
            _this.hostAddress = hostAddress;
        };
        highHttp.setGlobalHeader = function (key, value, priority) {
            _this.globalPriorityHeaders.add({ key: key, value: value, priority: priority });
        };
        highHttp.setWithCredentials = function (v) { return (_this.withCredentials = v); };
    };
    VoyoBasePlugin.prototype.defineResponseType = function (httpParams, req) {
        req.responseType = httpParams.responseType || this.defaultResponseType;
    };
    VoyoBasePlugin.prototype.defineRequestUrl = function (httpParams, req) {
        req.url = req.url || joinUrl(this.hostAddress, httpParams.path);
    };
    /**
     * @override
     * @param http
     * @param httpParams
     */
    VoyoBasePlugin.prototype.before = function (_a) {
        var _b;
        var http = _a.http, httpParams = _a.httpParams;
        var req = http.req;
        var _c = httpParams.headers, headers = _c === void 0 ? {} : _c, _d = httpParams.priorityHeaders, priorityHeaders = _d === void 0 ? {} : _d;
        req.headers = req.headers || {};
        this.defineRequestUrl(httpParams, req);
        this.defineResponseType(httpParams, req);
        req.withCredentials = (_b = httpParams.withCredentials) !== null && _b !== void 0 ? _b : this.withCredentials;
        var priorityHeader = new PriorityHeaders(Object.assign(headers, req.headers), priorityHeaders);
        var voyoInfo = (req.voyoInfo = req.voyoInfo || {});
        /**
         * queryParams
         */
        if (httpParams.query) {
            http.req.url +=
                "?" +
                    queryparams.encode(httpParams.query, nullishCoalescing(httpParams.queryURIEncode, true));
        }
        if (httpParams.json) {
            !httpParams.noAutoHeader && priorityHeader.addType("application/json");
            req.body = JSON.stringify(httpParams.json);
            voyoInfo.contentType = "json";
        }
        else if (httpParams.arrayBuffer || httpParams.blob) {
            !httpParams.noAutoHeader &&
                priorityHeader.addType("application/octet-stream");
            req.body = httpParams.arrayBuffer || httpParams.blob;
            voyoInfo.contentType = "stream";
        }
        else if (httpParams.formData) {
            // !httpParams.noAutoHeader &&
            //   priorityHeader.addType("application/x-www-form-urlencoded");
            req.body = httpParams.formData;
            voyoInfo.contentType = "formData";
        }
        else {
            !httpParams.noAutoHeader &&
                priorityHeader.addType(this.defaultContentType);
            req.body = httpParams.body;
        }
        req.headers = Object.assign(req.headers, priorityHeader.combineToRecord(priorityHeader.data, this.globalPriorityHeaders.data));
        return Promise.resolve();
    };
    /**
     * @override
     * @param httpPluginHandlers
     */
    VoyoBasePlugin.prototype.registryHooks = function (_a) {
        var httpPluginHandlers = _a.httpPluginHandlers;
        httpPluginHandlers.afterCompletion.tap(function (_a) {
            var res = _a.res, req = _a.req;
            if (req.responseType === "json" &&
                res.result &&
                typeof res.result === "string") {
                try {
                    res.result = JSON.parse(res.result);
                }
                catch (e) {
                    console.debug("Failed to parse JSON format.", e);
                }
            }
        }, this.priority);
    };
    VoyoBasePlugin.prototype.after = function (successResult, beforeParams) {
        var res = successResult.http.res;
        successResult.statusCode = res.status;
        successResult.result = res.result;
        return Promise.resolve();
    };
    return VoyoBasePlugin;
}());
export { VoyoBasePlugin };
