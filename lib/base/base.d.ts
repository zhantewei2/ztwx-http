import { Headers, HttpMethod } from "../interface";
export declare class BaseCapacity {
    assemblyHeader(xhr: XMLHttpRequest, headers: Headers): void;
    isUrlMethod(method: HttpMethod): boolean;
    isJsonMethod(method: HttpMethod): boolean;
}
