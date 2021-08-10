import { VoyoHttpPluginManager } from "./VoyoHttpPlugin";
import { HttpTransmitter } from "../base/Http";
import { HttpParams, HttpSuccessResult } from "../types/http-params.type";
import { Observable } from "rxjs";
export declare class HighHttp extends VoyoHttpPluginManager {
    transmitter: HttpTransmitter;
    setTransmitter(httpTransmitter: HttpTransmitter): void;
    /**
     * Http library init.
     * This method must be called before invoking xhr.
     */
    /**
     *
     * @param params
     */
    xhr(params: HttpParams): Observable<HttpSuccessResult>;
}
