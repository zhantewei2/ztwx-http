export var xhrAssemblyHeader = function (xhr, headers) {
    return headers &&
        Object.keys(headers).forEach(function (key) {
            headers[key] == undefined && xhr.setRequestHeader(key, headers[key]);
        });
};
/**
 * Do not need include babel async/await runtime polyfill..
 */
export var arrRunAsync = function (arr, params) {
    try {
        arr.length &&
            arr[0](function (nextParams) { return arrRunAsync(arr.slice(1), nextParams); }, params);
    }
    catch (e) {
        console.error(e);
    }
};
export var arrForEachAsync = function (arr, end) {
    arr.length ? arr[0](function () { return arrForEachAsync(arr.slice(1), end); }) : end();
};
export var responseHeaderToDict = function (responseHeaders) {
    if (!responseHeaders)
        return {};
    var dict = {};
    var key, value;
    responseHeaders
        .trim()
        .split(/[\r\n]+/)
        .forEach(function (responseHeader) {
        var _a;
        if (!responseHeaders)
            return;
        _a = responseHeader.split(": "), key = _a[0], value = _a[1];
        dict[key] = value;
    });
    return dict;
};
export var patchUnsubscribe = function (ob, patch) {
    var _unsubscribe = ob.unsubscribe;
    ob.unsubscribe = function () {
        patch();
        _unsubscribe.call(ob);
    };
};
export var nullishCoalescing = function (val, defaultVal) {
    return val === undefined || val === null ? defaultVal : val;
};
export var joinUrl = function (url, path) {
    if (url === void 0) { url = ""; }
    if (path === void 0) { path = ""; }
    return (url[url.length - 1] === "/" ? url.slice(0, url.length - 1) : url) +
        (path[0] === "/" ? path : "/" + path);
};
export var isObject = function (obj) {
    return Object.prototype.toString.call(obj).toLowerCase() === "[object object]";
};
