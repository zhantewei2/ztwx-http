import { Observable } from "rxjs";
import { error } from "../utils";
import { defineContentType } from "./define-content-type";
export var queryStringify = function (obj) {
    if (!obj)
        return "";
    var str = "?";
    for (var i in obj) {
        str += i + "=" + obj[i] + "&";
    }
    return str.slice(0, -1);
};
var BaseHttp = /** @class */ (function () {
    function BaseHttp() {
    }
    BaseHttp.prototype.send = function (method, url, params, headers) {
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
                        subscriber.next({
                            status: xhr.status,
                            content: xhr.responseText,
                        });
                        subscriber.complete();
                    }
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
    BaseHttp.prototype.assemblyHeader = function (xhr, headers) {
        if (!headers)
            return;
        var headerKeys = Object.keys(headers);
        if (!headerKeys || !headerKeys.length)
            return;
        headerKeys.forEach(function (key) {
            xhr.setRequestHeader(key, headers[key]);
        });
    };
    BaseHttp.prototype.isUrlMethod = function (method) {
        return method === "get" || method === "delete";
    };
    BaseHttp.prototype.isJsonMethod = function (method) {
        return ["get", "delete", "post", "put", "update"].indexOf(method) >= 0;
    };
    BaseHttp.prototype.sendXhr = function (xhr, method, url, params, headers) {
        var sendBody = "";
        if (this.isUrlMethod(method)) {
            xhr.open(method.toUpperCase(), url + queryStringify(params));
        }
        else {
            sendBody = params;
            xhr.open(method.toUpperCase(), url);
        }
        headers = headers || {};
        if (!headers["Content-Type"])
            headers["Content-Type"] = defineContentType(method);
        this.assemblyHeader(xhr, headers);
        xhr.send(sendBody);
    };
    return BaseHttp;
}());
export { BaseHttp };
