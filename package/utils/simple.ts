import { additionUrl } from "@ztwx/utils/lib/url";
export type Params = Record<string, any>;
export type Method = "get" | "post" | "put";

export const xhrAssemblyHeader = (xhr: XMLHttpRequest, headers: Params) =>
  headers &&
  Object.entries(headers).forEach(([key, val]) =>
    xhr.setRequestHeader(key, val),
  );

export class SampleHttp {
  globalHeaders: Record<string, any> = {};
  addGlobalHeader(key: string, val: string) {
    this.globalHeaders[key] = val;
  }
  constructor() {}
  send({
    method,
    url,
    query,
    json,
    body,
    headers = {},
  }: {
    method: Method;
    url: string;
    query?: Params;
    json?: Params;
    body?: BodyInit;
    headers?: Params;
  }) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.responseType = "json";
      headers = Object.assign(
        {
          "content-type": "application/json",
          ...headers,
        },
        this.globalHeaders,
      );

      if (query) additionUrl(url, query);
      if (json) body = JSON.stringify(json);

      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4 || xhr.status === 0) return;

        xhr.status == 200
          ? resolve({
              status: xhr.status,
              content: xhr.response,
            })
          : reject({
              status: xhr.status,
              content: xhr.response,
            });
      };
      xhr.open(method, url);
      xhrAssemblyHeader(xhr, headers);
      xhr.withCredentials = true;
      xhr.send(body);
    });
  }
}

export const sampleHttp = new SampleHttp();
