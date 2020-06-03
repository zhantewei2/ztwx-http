import { BaseHttpInterface, HttpMethod, Params, RequestResult, Headers } from "../interface";
import { BaseCapacity } from "./base";
import { Observable } from "rxjs";
export declare class BaseHttpUniapp extends BaseCapacity implements BaseHttpInterface {
    send(method: HttpMethod, url: string, params: Params, headers?: Headers): Observable<RequestResult>;
}
