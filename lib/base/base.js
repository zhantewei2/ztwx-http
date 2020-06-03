var BaseCapacity = /** @class */ (function () {
    function BaseCapacity() {
    }
    BaseCapacity.prototype.assemblyHeader = function (xhr, headers) {
        if (!headers)
            return;
        var headerKeys = Object.keys(headers);
        if (!headerKeys || !headerKeys.length)
            return;
        headerKeys.forEach(function (key) {
            xhr.setRequestHeader(key, headers[key]);
        });
    };
    BaseCapacity.prototype.isUrlMethod = function (method) {
        return method === "get" || method === "delete";
    };
    BaseCapacity.prototype.isJsonMethod = function (method) {
        return ["get", "delete", "post", "put", "update"].indexOf(method) >= 0;
    };
    return BaseCapacity;
}());
export { BaseCapacity };
