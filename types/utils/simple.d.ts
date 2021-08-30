export declare type Params = Record<string, any>;
export declare type Method = "get" | "post" | "put";
export declare const xhrAssemblyHeader: (xhr: XMLHttpRequest, headers: Params) => void;
export declare class SampleHttp {
    globalHeaders: Record<string, any>;
    addGlobalHeader(key: string, val: string): void;
    constructor();
    send({ method, url, query, json, body, headers, }: {
        method: Method;
        url: string;
        query?: Params;
        json?: Params;
        body?: BodyInit;
        headers?: Params;
    }): Promise<unknown>;
}
export declare const sampleHttp: SampleHttp;
