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
    var mapStr = {
        "+": "%2B",
        " ": "%20",
        "/": "%2F",
        "?": "%3F",
        "%": "%25",
        "#": "%23",
        "&": "%26",
        "=": "%3D",
    };
    for (var i in obj) {
        str +=
            i +
                "=" +
                (obj[i] + "").replace(/\+|\s|\/|\?|%|#|&|=/g, function (item) { return mapStr[item]; }) +
                "&";
    }
    return str.slice(0, -1);
};
var BaseHttpXhr = /** @class */ (function (_super) {
    __extends(BaseHttpXhr, _super);
    function BaseHttpXhr() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseHttpXhr.prototype.send = function (method, url, params, headers) {
        var _this = this;
        var xhr = new XMLHttpRequest();
        return new Observable(function (subscriber) {
            xhr.onload = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status === 0) {
                        error("connect failure...address: " + url);
                        subscriber.error({ status: 0, content: "connect failure" });
                    }
                    else {
                        var resultContent = void 0;
                        try {
                            resultContent = JSON.parse(xhr.responseText);
                        }
                        catch (e) {
                            resultContent = xhr.responseText;
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
            _this.sendXhr(xhr, method, url, params, headers);
        });
    };
    BaseHttpXhr.prototype.sendXhr = function (xhr, method, url, params, headers) {
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
        if (!headers["Content-Type"])
            headers["Content-Type"] = contentType;
        this.assemblyHeader(xhr, headers);
        xhr.withCredentials = true;
        xhr.send(sendBody);
    };
    return BaseHttpXhr;
}(BaseCapacity));
export { BaseHttpXhr };
export var BaseHttp = isUni() ? BaseHttpUniapp : BaseHttpXhr;
