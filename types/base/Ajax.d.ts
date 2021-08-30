import { Http, HttpTransmitter } from "./Http";
import { Observable } from "rxjs";
import { HttpSuccessResult } from "../types/http-params.type";
export declare class Ajax implements HttpTransmitter {
    xhr: XMLHttpRequest;
    /**
     * Making an Ajax request
     */
    start(http: Http): Observable<HttpSuccessResult>;
}
