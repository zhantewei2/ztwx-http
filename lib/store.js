var Store = /** @class */ (function () {
    function Store(maxCount, disCount) {
        if (maxCount === void 0) { maxCount = 100; }
        if (disCount === void 0) { disCount = 10; }
        this.size = 0;
        this.map = new Map();
        this.maxCount = maxCount;
        this.disCount = disCount;
        this.maxCountRel = this.disCount + this.maxCount;
    }
    Store.prototype.setValue = function (key, value) {
        if (this.size >= this.maxCountRel)
            this.clearNest();
        this.map.set(key, value);
    };
    Store.prototype.getValue = function (key) {
        return this.map.get(key);
    };
    Store.prototype.deleteKey = function (key) {
        this.map.delete(key);
    };
    Store.prototype.clearNest = function () {
        var currentIndex = 0;
        for (var _i = 0, _a = this.map.keys(); _i < _a.length; _i++) {
            var key = _a[_i];
            if (currentIndex++ >= this.maxCount)
                break;
            this.map.delete(key);
        }
    };
    return Store;
}());
export { Store };
