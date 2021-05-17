import { arrForEachAsync, arrRunAsync } from "./utils";

export class Tapable<T> {
  list: Array<(p: T) => void>;
  tap(callback: (p: T) => void) {
    this.list = this.list || [];
    this.list.push(callback);
  }

  run(p: T) {
    this.list && this.list.forEach((run) => run(p));
  }
}
export class TapableInline<T> {
  list: Array<(p: T) => T>;
  tap(callback: (p: T) => T) {
    this.list = this.list || [];
    this.list.push(callback);
  }
  runInline(p: T): T {
    if (!this.list) return p;
    for (const run of this.list) {
      p = run(p);
    }
    return p;
  }
}

export type TapableAsyncRun = <T>(p: T) => Promise<any>;

export class TapableAsync<T> {
  list: Array<TapableAsyncRun>;
  tapAsync(callback: TapableAsyncRun) {
    this.list = this.list || [];
    this.list.push(callback);
  }
  run(p: T): Promise<void> {
    return !this.list
      ? Promise.resolve(undefined)
      : new Promise((resolve, reject) =>
          arrForEachAsync(
            this.list.map((i) => (next) => i(p).then(next).catch(reject)),
            resolve,
          ),
        );
  }
}
