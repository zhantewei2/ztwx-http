import { __assign } from "tslib";
import { additionUrl } from "@ztwx/utils/lib/url";
export var xhrAssemblyHeader = function (xhr, headers) {
    return headers &&
        Object.entries(headers).forEach(function (_a) {
            var key = _a[0], val = _a[1];
            return xhr.setRequestHeader(key, val);
        });
};
var SampleHttp = /** @class */ (function () {
    function SampleHttp() {
        this.globalHeaders = {};
    }
    SampleHttp.prototype.addGlobalHeader = function (key, val) {
        this.globalHeaders[key] = val;
    };
    SampleHttp.prototype.send = function (_a) {
        var _this = this;
        var method = _a.method, url = _a.url, query = _a.query, json = _a.json, body = _a.body, _b = _a.headers, headers = _b === void 0 ? {} : _b;
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.responseType = "json";
            headers = Object.assign(__assign({ "content-type": "application/json" }, headers), _this.globalHeaders);
            if (query)
                additionUrl(url, query);
            if (json)
                body = JSON.stringify(json);
            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4 || xhr.status === 0)
                    return;
                xhr.status == 200
                    ? resolve({
                        status: xhr.status,
                        content: xhr.response,
                    })
                    : reject({
                        status: xhr.status,
                        content: xhr.response,
                    });
            };
            xhr.open(method, url);
            xhrAssemblyHeader(xhr, headers);
            xhr.withCredentials = true;
            xhr.send(body);
        });
    };
    return SampleHttp;
}());
export { SampleHttp };
export var sampleHttp = new SampleHttp();
