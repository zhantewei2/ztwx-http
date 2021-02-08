import { __extends } from "tslib";
import { Observable } from "rxjs";
import { error, isUni } from "../utils";
import { defineContentType } from "./define-content-type";
import { BaseCapacity } from "./base";
import { BaseHttpUniapp } from "./base-http-uniapp";
export var queryStringify = function (obj) {
    if (!obj)
        return "";
    var str = "?";
    for (var i in obj) {
        str += i + "=" + obj[i] + "&";
    }
    return str.slice(0, -1);
};
var BaseHttpXhr = /** @class */ (function (_super) {
    __extends(BaseHttpXhr, _super);
    function BaseHttpXhr() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseHttpXhr.prototype.send = function (method, url, params, headers, withCredentials, responseType) {
        var _this = this;
        var xhr = new XMLHttpRequest();
        if (responseType)
            xhr.responseType = responseType;
        return new Observable(function (subscriber) {
            xhr.onload = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status === 0) {
                        error("connect failure...address: " + url);
                        subscriber.error({ status: 0, content: "connect failure" });
                    }
                    else {
                        var resultContent = void 0;
                        if (responseType && responseType !== "text") {
                            resultContent = xhr.response;
                        }
                        else {
                            try {
                                resultContent = JSON.parse(xhr.responseText);
                            }
                            catch (e) {
                                resultContent = xhr.responseText;
                            }
                        }
                        subscriber.next({
                            status: xhr.status,
                            content: resultContent,
                        });
                    }
                    subscriber.complete();
                }
            };
            var oldUnsubscribe = subscriber.unsubscribe;
            subscriber.unsubscribe = function () {
                xhr.abort();
                oldUnsubscribe.call(subscriber);
            };
            subscriber.cancel = function () { return xhr.abort(); };
            _this.sendXhr(xhr, method, url, params, headers, withCredentials);
        });
    };
    BaseHttpXhr.prototype.sendXhr = function (xhr, method, url, params, headers, withCredentials) {
        var sendBody = "";
        var _a = defineContentType(method), contentType = _a.contentType, targetMethod = _a.targetMethod;
        if (this.isUrlMethod(targetMethod)) {
            xhr.open(targetMethod.toUpperCase(), url + queryStringify(params));
        }
        else {
            if (contentType === "application/json") {
                try {
                    sendBody = JSON.stringify(params);
                }
                catch (e) {
                    sendBody = params;
                }
            }
            else {
                sendBody = params;
            }
            xhr.open(targetMethod.toUpperCase(), url);
        }
        headers = headers || {};
        if (!headers["Content-Type"] && contentType)
            headers["Content-Type"] = contentType;
        this.assemblyHeader(xhr, headers);
        xhr.withCredentials = !!withCredentials;
        xhr.send(sendBody);
    };
    return BaseHttpXhr;
}(BaseCapacity));
export { BaseHttpXhr };
export var BaseHttp = isUni() ? BaseHttpUniapp : BaseHttpXhr;
export var getBaseHttp = function (requestLib) {
    if (requestLib === "auto") {
        return isUni() ? BaseHttpUniapp : BaseHttpXhr;
    }
    else if (requestLib === "uni") {
        return BaseHttpUniapp;
    }
    else {
        return BaseHttpXhr;
    }
};
