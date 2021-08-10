export var DEFAULT_PRIORITY = 0;
var PriorityHeaders = /** @class */ (function () {
    function PriorityHeaders(headers, mergePriorityHeaders) {
        this.data = {};
        var priorityHeader = {};
        for (var i in headers) {
            priorityHeader[i] = {
                value: headers[i],
                priority: DEFAULT_PRIORITY,
            };
        }
        this.data = !mergePriorityHeaders
            ? priorityHeader
            : Object.assign(priorityHeader, mergePriorityHeaders);
    }
    PriorityHeaders.prototype.addType = function (content) {
        this.add({ key: "Content-Type", value: content }, false);
    };
    PriorityHeaders.prototype.add = function (item, override) {
        if (override === void 0) { override = true; }
        if (!override && this.data[item.key])
            return;
        this.data[item.key] = {
            value: item.value,
            priority: item.priority || DEFAULT_PRIORITY,
        };
    };
    PriorityHeaders.prototype.combineToRecord = function (data, data2) {
        var combineRecord = {};
        new Set(Object.keys(data).concat(Object.keys(data2))).forEach(function (key) {
            combineRecord[key] = !data[key]
                ? data2[key].value
                : !data2[key]
                    ? data[key].value
                    : data[key].priority >= data2[key].priority
                        ? data[key].value
                        : data2[key].value;
        });
        return combineRecord;
    };
    return PriorityHeaders;
}());
export { PriorityHeaders };
