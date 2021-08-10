var LimitStore = /** @class */ (function () {
    function LimitStore(maxCount, controllerCount) {
        if (maxCount === void 0) { maxCount = 100; }
        if (controllerCount === void 0) { controllerCount = 10; }
        this.store = new Map();
        this.total = 0;
        this.maxCount = maxCount;
        this.controllerCount = controllerCount;
    }
    LimitStore.prototype.add = function (key, val) {
        if (!this.store.has(key)) {
            this.store.set(key, val);
            this.total++;
            this.addCheck();
        }
    };
    LimitStore.prototype.has = function (key) {
        return this.store.has(key);
    };
    LimitStore.prototype.get = function (key) {
        return this.store.get(key);
    };
    LimitStore.prototype.addCheck = function () {
        if (this.total > this.maxCount) {
            var c = 0;
            var keys = this.store.keys();
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var i = keys_1[_i];
                this.store.delete(i);
                if (++c > this.controllerCount)
                    break;
            }
            this.total -= this.controllerCount;
        }
    };
    LimitStore.prototype.del = function (key) {
        if (!this.store.has(key))
            return;
        this.store.delete(key);
        this.total--;
    };
    return LimitStore;
}());
export { LimitStore };
