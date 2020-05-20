export var defineContentType = function (method) {
    if (method === "postStream") {
        return "application/octet-stream";
    }
    else if (method === "postForm") {
        return "application/x-www-form-urlencoded";
    }
    else {
        return "application/json";
    }
};
