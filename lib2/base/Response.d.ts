import { HttpHeaders, HttpMethod } from "../types/http-base.type";
export declare class Response {
    status: number;
    method: HttpMethod;
    headers: HttpHeaders;
    result: BodyInit;
    xhr?: XMLHttpRequest;
}
