export var error = function (message) {
    console.error("ztwx-http error:", message);
};
export var warn = function (message) {
    console.warn("ztwx-http warn:", message);
};
export var isUni = function () {
    try {
        return !!uni;
    }
    catch (e) {
        return false;
    }
};
