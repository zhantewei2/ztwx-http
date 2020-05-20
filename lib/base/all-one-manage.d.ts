import { Observable, Subscription } from "rxjs";
export declare const AllOneManageKey = "ztwx-http-all-one-manage";
export interface QueueItem {
    key: string;
    observer: Observable<any>;
    subscription: Subscription;
    oneSubscription: Subscription;
}
export declare class AllOneManage {
    manageQueue: QueueItem[];
    append(key: string, observer: Observable<any>, subscription: Subscription, oneSubscription: Subscription): void;
    remove(key: string): void;
    exists(key: string): QueueItem | undefined;
}
declare const allOneManage: AllOneManage;
export { allOneManage };
