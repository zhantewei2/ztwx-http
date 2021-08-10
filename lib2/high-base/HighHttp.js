import { __extends } from "tslib";
import { VoyoHttpPluginManager } from "./VoyoHttpPlugin";
import { Http } from "../base/Http";
import { Exception } from "../base/Exception";
var HighHttp = /** @class */ (function (_super) {
    __extends(HighHttp, _super);
    function HighHttp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HighHttp.prototype.setTransmitter = function (httpTransmitter) {
        this.transmitter = httpTransmitter;
    };
    /**
     * Http library init.
     * This method must be called before invoking xhr.
     */
    // init() {
    //   this.initPlugin();
    // }
    /**
     *
     * @param params
     */
    HighHttp.prototype.xhr = function (params) {
        var _this = this;
        if (!this.transmitter)
            throw new Exception("Must specify an transmitter.");
        var http = new Http();
        http.req.url = params.url || "";
        http.req.method = params.method;
        return this.wrapperHttp(http, params, function () { return _this.transmitter.start(http); });
    };
    return HighHttp;
}(VoyoHttpPluginManager));
export { HighHttp };
