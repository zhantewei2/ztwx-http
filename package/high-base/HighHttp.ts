import { VoyoHttpPluginManager } from "./VoyoHttpPlugin";
import { Http, HttpTransmitter } from "../base/Http";
import {
  HttpParams,
  HttpSuccessResult,
  XhrSend,
} from "../types/http-params.type";
import { Observable } from "rxjs";
import { Exception } from "../base/Exception";

export class HighHttp extends VoyoHttpPluginManager {
  transmitter: HttpTransmitter;
  setTransmitter(httpTransmitter: HttpTransmitter) {
    this.transmitter = httpTransmitter;
  }

  /**
   * Http library init.
   * This method must be called before invoking xhr.
   */
  // init() {
  //   this.initPlugin();
  // }

  /**
   *
   * @param params
   */
  xhr(params: HttpParams): Observable<HttpSuccessResult> {
    if (!this.transmitter) throw new Exception("Must specify an transmitter.");
    const http = new Http();
    http.req.url = params.url || "";
    http.req.method = params.method;
    return this.wrapperHttp(http, params, () => this.transmitter.start(http));
  }
}
