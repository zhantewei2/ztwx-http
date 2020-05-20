import { Observable, Subscription } from "rxjs";

export const AllOneManageKey = "ztwx-http-all-one-manage";

export interface QueueItem {
  key: string;
  observer: Observable<any>;
  subscription: Subscription;
  oneSubscription: Subscription;
}

export class AllOneManage {
  manageQueue: QueueItem[] = [];
  append(
    key: string,
    observer: Observable<any>,
    subscription: Subscription,
    oneSubscription: Subscription,
  ) {
    this.manageQueue.push({
      key,
      observer,
      subscription,
      oneSubscription,
    });
  }
  remove(key: string) {
    const itemIndex: number = this.manageQueue.findIndex((i) => i.key === key);
    if (itemIndex >= 0) this.manageQueue.splice(itemIndex, 1);
  }
  exists(key: string): QueueItem | undefined {
    return this.manageQueue.find((i) => i.key === key);
  }
}
const win: any = window;
const allOneManage: AllOneManage = win[AllOneManageKey]
  ? win[AllOneManageKey]
  : new AllOneManage();

export { allOneManage };
