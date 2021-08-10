export class LimitStore<T> {
  store: Map<string, T> = new Map<string, T>();
  total = 0;
  maxCount: number;
  controllerCount: number;

  constructor(maxCount = 100, controllerCount = 10) {
    this.maxCount = maxCount;
    this.controllerCount = controllerCount;
  }
  add(key: string, val: T) {
    if (!this.store.has(key)) {
      this.store.set(key, val);
      this.total++;
      this.addCheck();
    }
  }
  has(key: string): boolean {
    return this.store.has(key);
  }
  get(key: string): T | undefined {
    return this.store.get(key);
  }
  addCheck() {
    if (this.total > this.maxCount) {
      let c = 0;
      const keys: any = this.store.keys();
      for (const i of keys) {
        this.store.delete(i);
        if (++c > this.controllerCount) break;
      }
      this.total -= this.controllerCount;
    }
  }

  del(key: string) {
    if (!this.store.has(key)) return;
    this.store.delete(key);
    this.total--;
  }
}
