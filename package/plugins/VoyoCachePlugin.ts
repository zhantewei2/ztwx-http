import {
  BeForeBreakInfo,
  HttpAfterParams,
  HttpBeforeParams,
  VoyoHttpPlugin,
} from "../high-base/VoyoHttpPlugin";
export { LimitStore } from "./limitStore";
import { LimitStore } from "./limitStore";
import { of } from "rxjs";
import { Response } from "../base/Response";
import { Request } from "../base/Request";

declare module "../types/http-params.type" {
  interface HttpParams {
    cacheOpts?: {
      key: string; //cache key
      expireSeconds?: number; //default 0 for never expire.
      shouldCache?: ShouldCache;
      // onDestroy?: (params: HttpParams) => boolean; Not implement.
    };
  }
}
export type ShouldCache = (result: HttpAfterParams) => boolean;
export interface VoyoCachePluginOpts {
  maxCount?: number;
  controllerCount?: number;
  /*
   *  default 0
   *  Control the global expiration.
   *  value of 0 indicates that it will never expire.
   */
  defaultExpireSeconds?: number;
  shouldCache?: ShouldCache;
}
export interface CacheHttp {
  res: Response;
  req: Request;
}

export interface VoyoCacheStoreVal {
  expireDate: number;
  http: CacheHttp;
}

export class VoyoCachePlugin implements VoyoHttpPlugin {
  name = "voyo-cache-plugin";
  priority = 99;
  defaultExpireSeconds: number;
  limitStore: LimitStore<VoyoCacheStoreVal>;
  shouldCache: ShouldCache | undefined;

  getNowDate() {
    return Math.round(Date.now() / 1000);
  }

  constructor({
    maxCount,
    controllerCount,
    defaultExpireSeconds,
    shouldCache,
  }: VoyoCachePluginOpts) {
    this.defaultExpireSeconds = defaultExpireSeconds || 0;
    this.limitStore = new LimitStore<VoyoCacheStoreVal>(
      maxCount,
      controllerCount,
    );
    this.shouldCache = shouldCache;
  }
  isExpire(key: string, expireDate: number): boolean {
    if (expireDate === 0) return false;
    if (expireDate < this.getNowDate()) {
      this.limitStore.del(key);
      return true;
    }
    return false;
  }

  before({
    http,
    httpParams: { cacheOpts },
  }: HttpBeforeParams): Promise<void | BeForeBreakInfo> {
    if (cacheOpts && cacheOpts.key) {
      const info = this.limitStore.get(cacheOpts.key);
      if (info) {
        if (!this.isExpire(cacheOpts.key, info.expireDate)) {
          Object.assign(http.res, info.http.res);
          Object.assign(http.req, info.http.req);
          return Promise.resolve(of({ http }));
        }
      }
    }
    return Promise.resolve();
  }
  after(
    result: HttpAfterParams,
    { httpParams: { cacheOpts }, http }: HttpBeforeParams,
  ) {
    if (!cacheOpts) return Promise.resolve();

    if (
      (this.shouldCache && !this.shouldCache(result)) ||
      (cacheOpts.shouldCache && !cacheOpts.shouldCache(result))
    )
      return Promise.resolve();

    this.limitStore.add(cacheOpts.key, {
      expireDate:
        cacheOpts.expireSeconds == null
          ? this.defaultExpireSeconds
          : this.getNowDate() + cacheOpts.expireSeconds,
      http: {
        req: http.req,
        res: http.res,
      },
    });
    return Promise.resolve();
  }
}
