export var AllOneManageKey = "ztwx-http-all-one-manage";
var AllOneManage = /** @class */ (function () {
    function AllOneManage() {
        this.manageQueue = [];
    }
    AllOneManage.prototype.append = function (key, observer, subscription, oneSubscription) {
        this.manageQueue.push({
            key: key,
            observer: observer,
            subscription: subscription,
            oneSubscription: oneSubscription,
        });
    };
    AllOneManage.prototype.remove = function (key) {
        var itemIndex = this.manageQueue.findIndex(function (i) { return i.key === key; });
        if (itemIndex >= 0)
            this.manageQueue.splice(itemIndex, 1);
    };
    AllOneManage.prototype.exists = function (key) {
        return this.manageQueue.find(function (i) { return i.key === key; });
    };
    return AllOneManage;
}());
export { AllOneManage };
var allOneManage = new AllOneManage();
export { allOneManage };
