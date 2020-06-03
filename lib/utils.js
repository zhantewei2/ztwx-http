export var error = function (message) {
    console.error("ztwx-http error:", message.toString());
};
export var warn = function (message) {
    console.warn("ztwx-http warn:", message);
};
export var isUni = function () { return !!uni; };
