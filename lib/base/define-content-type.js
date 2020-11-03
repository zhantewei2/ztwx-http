export var defineContentType = function (method) {
    var contentType;
    var targetMethod = method;
    if (method === "postStream") {
        contentType = "application/octet-stream";
        targetMethod = "post";
    }
    else if (method === "postForm") {
        // contentType = "application/x-www-form-urlencoded";
        contentType = "";
        targetMethod = "post";
    }
    else {
        contentType = "application/json";
    }
    return { targetMethod: targetMethod, contentType: contentType };
};
