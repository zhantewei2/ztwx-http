import { queryparams } from "@ztwx/utils/lib/url";
import {
  HttpAfterParams,
  HttpApplyParams,
  HttpBeforeParams,
  HttpWrapperParams,
  VoyoHttpPlugin,
} from "../high-base/VoyoHttpPlugin";
import { joinUrl, nullishCoalescing } from "../utils/utils";
import { HttpHeaders } from "../types/http-base.type";
import { HighHttp } from "../high-base/HighHttp";
import { PriorityHeaderRecord, PriorityHeaders } from "./PriorityHeaders";
import { HttpParams, HttpSuccessResult } from "../types/http-params.type";
import { Request } from "../base/Request";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export type HttpResult = BodyInit | Record<string, any>;

declare module "../types/http-params.type" {
  interface HttpParams {
    path?: string;
    headers?: HttpHeaders;
    priorityHeaders?: PriorityHeaderRecord;
    queryURIEncode?: boolean;
    query?: Record<string, any>;
    json?: Record<string, any>;
    arrayBuffer?: ArrayBuffer;
    blob?: Blob;
    formData?: FormData;
    body?: BodyInit;
    responseType?: XMLHttpRequestResponseType;
    withCredentials?: boolean;
    noAutoHeader?: boolean;
  }
  interface HttpSuccessResult {
    result?: HttpResult;
    statusCode?: number;
  }
}
declare module "../high-base/HighHttp" {
  interface HighHttp {
    setHost(v: string): void;
    setGlobalHeader(k: string, v: any, priority?: number): void;
    setWithCredentials(v: boolean): void;
  }
}

export class VoyoBasePlugin implements VoyoHttpPlugin {
  name = "voyo-base-plugin";
  priority = 100;
  hostAddress: string;
  globalPriorityHeaders: PriorityHeaders = new PriorityHeaders({});
  withCredentials = true;
  public defaultContentType = "application/json";
  public defaultResponseType: XMLHttpRequestResponseType = "json";

  /**
   * @override
   * @param highHttp
   */
  patchCall(highHttp: HighHttp) {
    highHttp.setHost = (hostAddress: string) => {
      this.hostAddress = hostAddress;
    };
    highHttp.setGlobalHeader = (key: string, value: any, priority?: number) => {
      this.globalPriorityHeaders.add({ key, value, priority });
    };
    highHttp.setWithCredentials = (v: boolean) => (this.withCredentials = v);
  }
  defineResponseType(httpParams: HttpParams, req: Request) {
    req.responseType = httpParams.responseType || this.defaultResponseType;
  }
  defineRequestUrl(httpParams: HttpParams, req: Request) {
    req.url = req.url || joinUrl(this.hostAddress, httpParams.path);
  }
  /**
   * @override
   * @param http
   * @param httpParams
   */
  before({ http, httpParams }: HttpBeforeParams): Promise<void> {
    const { req } = http;
    const { headers = {}, priorityHeaders = {} } = httpParams;

    req.headers = req.headers || {};
    this.defineRequestUrl(httpParams, req);
    this.defineResponseType(httpParams, req);
    req.withCredentials = httpParams.withCredentials ?? this.withCredentials;
    const priorityHeader = new PriorityHeaders(
      Object.assign(headers, req.headers),
      priorityHeaders,
    );

    const voyoInfo = (req.voyoInfo = req.voyoInfo || {});
    /**
     * queryParams
     */
    if (httpParams.query) {
      http.req.url +=
        "?" +
        queryparams.encode(
          httpParams.query,
          nullishCoalescing(httpParams.queryURIEncode, true),
        );
    }
    if (httpParams.json) {
      !httpParams.noAutoHeader && priorityHeader.addType("application/json");
      req.body = JSON.stringify(httpParams.json);
      voyoInfo.contentType = "json";
    } else if (httpParams.arrayBuffer || httpParams.blob) {
      !httpParams.noAutoHeader &&
        priorityHeader.addType("application/octet-stream");
      req.body = httpParams.arrayBuffer || httpParams.blob;
      voyoInfo.contentType = "stream";
    } else if (httpParams.formData) {
      !httpParams.noAutoHeader &&
        priorityHeader.addType("application/x-www-form-urlencoded");
      req.body = httpParams.formData;
      voyoInfo.contentType = "formData";
    } else {
      !httpParams.noAutoHeader &&
        priorityHeader.addType(this.defaultContentType);
      req.body = httpParams.body;
    }

    req.headers = Object.assign(
      req.headers,
      priorityHeader.combineToRecord(
        priorityHeader.data,
        this.globalPriorityHeaders.data,
      ),
    );

    return Promise.resolve();
  }

  /**
   * @override
   * @param httpPluginHandlers
   */
  registryHooks({ httpPluginHandlers }: HttpApplyParams) {
    httpPluginHandlers.afterCompletion.tap(({ res, req }) => {
      if (
        req.responseType === "json" &&
        res.result &&
        typeof res.result === "string"
      ) {
        try {
          res.result = JSON.parse(res.result as string);
        } catch (e) {
          console.debug("Failed to parse JSON format.", e);
        }
      }
    }, this.priority);
  }
  after(
    successResult: HttpAfterParams,
    beforeParams?: HttpBeforeParams,
  ): Promise<void> {
    const res = successResult.http.res;
    successResult.statusCode = res.status;
    successResult.result = res.result;
    return Promise.resolve();
  }
  /**
   * @override
   * @param httpObserver
   */
  // wrapper({ httpObserver }: HttpWrapperParams): Observable<HttpSuccessResult> {
  //   return httpObserver.pipe(
  //     map((httpSuccessResult) => {
  //       const res = httpSuccessResult.http.res;
  //       httpSuccessResult.statusCode = res.status;
  //       httpSuccessResult.result = res.result;
  //       return httpSuccessResult;
  //     }),
  //   );
  // }
}
