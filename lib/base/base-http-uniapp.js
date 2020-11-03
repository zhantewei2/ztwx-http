import { __extends } from "tslib";
import { BaseCapacity } from "./base";
import { Observable } from "rxjs";
import { error } from "../utils";
import { defineContentType } from "./define-content-type";
var BaseHttpUniapp = /** @class */ (function (_super) {
    __extends(BaseHttpUniapp, _super);
    function BaseHttpUniapp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseHttpUniapp.prototype.send = function (method, url, params, headers, withCredentials) {
        var _a = defineContentType(method), targetMethod = _a.targetMethod, contentType = _a.contentType;
        return new Observable(function (ob) {
            var reqTask = uni.request({
                url: url,
                method: targetMethod,
                data: params,
                withCredentials: withCredentials,
                header: Object.assign({
                    "content-type": contentType,
                }, headers || {}),
                success: function (_a) {
                    var data = _a.data, statusCode = _a.statusCode, header = _a.header;
                    ob.next({ status: statusCode, content: data, header: header });
                    ob.complete();
                },
                fail: function (errorResp) {
                    error(errorResp);
                    ob.error({ status: 0, content: "connect failure" });
                    ob.complete();
                },
            });
            var oldUnsub = ob.unsubscribe;
            ob.unsubscribe = function () {
                reqTask.abort();
                oldUnsub.call(ob);
            };
            ob.cancel = function () { return reqTask.abort(); };
        });
    };
    return BaseHttpUniapp;
}(BaseCapacity));
export { BaseHttpUniapp };
