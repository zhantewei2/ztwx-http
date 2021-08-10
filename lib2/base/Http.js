import { Request } from "./Request";
import { Response } from "./Response";
var Http = /** @class */ (function () {
    function Http() {
        this.hooks = {};
        this.req = new Request();
        this.res = new Response();
    }
    return Http;
}());
export { Http };
