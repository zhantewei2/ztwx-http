import { __extends } from "tslib";
import { Ajax } from "./base/Ajax";
import { HighHttp } from "./high-base/HighHttp";
import { VoyoBasePlugin } from "./plugins/VoyoBasePlugin";
var VoyoHttp = /** @class */ (function (_super) {
    __extends(VoyoHttp, _super);
    function VoyoHttp(_a) {
        var _b = _a.transmitter, transmitter = _b === void 0 ? new Ajax() : _b;
        var _this = _super.call(this) || this;
        _this.setTransmitter(transmitter);
        _this.addPlugin(new VoyoBasePlugin());
        return _this;
    }
    return VoyoHttp;
}(HighHttp));
export { VoyoHttp };
