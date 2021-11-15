import { arrForEachAsync, arrRunAsync } from "./utils";

export class Tapable<T> {
  list: Array<{ run: (p: T) => void; priority: number }>;
  tap(run: (p: T) => void, priority: number) {
    this.list = this.list || [];
    this.list.push({ run, priority });
    this.list.sort((pre, next) => next.priority - pre.priority);
  }

  run(p: T) {
    this.list && this.list.forEach((i) => i.run(p));
  }
}
export class TapableInline<T> {
  list: Array<{ run: (p: T) => T; priority: number }>;
  tap(run: (p: T) => T, priority: number) {
    this.list = this.list || [];
    this.list.push({ run, priority });
    this.list.sort((pre, next) => next.priority - pre.priority);
  }
  runInline(p: T): T {
    if (!this.list) return p;
    for (const i of this.list) {
      p = i.run(p);
    }
    return p;
  }
}

export interface TapableAsyncRun<T> {
  (p: T): Promise<any>;
}

export class TapableAsync<T> {
  list: Array<{ run: TapableAsyncRun<T>; priority: number }>;
  tapAsync(callback: TapableAsyncRun<T>, priority: number) {
    this.list = this.list || [];
    this.list.push({ run: callback, priority });
    this.list.sort((pre, next) => next.priority - pre.priority);
  }

  /**
   * prevent next when @return false
   * @param p
   * @param mdBreak  break async if mdBreak exit
   */
  run(p: T, mdBreak?: boolean): Promise<any> {
    return !this.list
      ? Promise.resolve(undefined)
      : new Promise((resolve, reject) =>
          arrForEachAsync(
            this.list.map(
              (i) => (next) =>
                i
                  .run(p)
                  .then((md) => (md && mdBreak ? resolve(md) : next()))
                  .catch(reject),
            ),
            () => resolve(undefined),
          ),
        );
  }
}
