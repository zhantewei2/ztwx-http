import { Headers, HttpMethod } from "../interface";

export class BaseCapacity {
  assemblyHeader(xhr: XMLHttpRequest, headers: Headers) {
    if (!headers) return;
    const headerKeys: string[] = Object.keys(headers);
    if (!headerKeys || !headerKeys.length) return;
    headerKeys.forEach((key) => {
      xhr.setRequestHeader(key, (headers as any)[key]);
    });
  }
  isUrlMethod(method: HttpMethod): boolean {
    return method === "get" || method === "delete";
  }
  isJsonMethod(method: HttpMethod): boolean {
    return ["get", "delete", "post", "put", "update"].indexOf(method) >= 0;
  }
}
