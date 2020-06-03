import { HttpMethod } from "../interface";
export declare const defineContentType: (method: HttpMethod) => {
    targetMethod: HttpMethod;
    contentType: string;
};
