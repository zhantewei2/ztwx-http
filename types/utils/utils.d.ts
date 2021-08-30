import { HttpHeaders } from "../types/http-base.type";
import { Subscriber } from "rxjs";
export declare const xhrAssemblyHeader: (xhr: XMLHttpRequest, headers: HttpHeaders) => void;
/**
 * Do not need include babel async/await runtime polyfill..
 */
export declare const arrRunAsync: (arr: ((next: (nextParams?: any) => void, preParams?: any) => any)[], params?: any) => void;
export declare const arrForEachAsync: (arr: ((next: () => void) => void)[], end: () => void) => void;
export declare const responseHeaderToDict: (responseHeaders: string) => Record<string, any>;
export declare const patchUnsubscribe: (ob: Subscriber<any>, patch: () => void) => void;
export declare const nullishCoalescing: (val: any, defaultVal: any) => any;
export declare const joinUrl: (url?: string, path?: string) => string;
export declare const isObject: (obj: any) => boolean;
