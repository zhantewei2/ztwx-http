import { HttpMethod, Params, RequestResult, Headers } from "../interface";
import { Subscriber, Observable, Subscription } from "rxjs";
import { error } from "../utils";
import { defineContentType } from "./define-content-type";

export const queryStringify = (obj: Params) => {
  if (!obj) return "";
  let str = "?";
  for (const i in obj) {
    str += i + "=" + obj[i] + "&";
  }
  return str.slice(0, -1);
};

export class BaseHttp {
  send(
    method: HttpMethod,
    url: string,
    params: Params,
    headers?: Headers,
  ): Observable<RequestResult> {
    const xhr = new XMLHttpRequest();
    return new Observable((subscriber: Subscriber<any>) => {
      xhr.onload = () => {
        if (xhr.readyState == 4) {
          if (xhr.status === 0) {
            error(`connect failure...address: ${url}`);
            subscriber.error({ status: 0, content: "connect failure" });
          } else {
            subscriber.next({
              status: xhr.status,
              content: xhr.responseText,
            });
            subscriber.complete();
          }
        }
      };
      const oldUnsubscribe = subscriber.unsubscribe;
      subscriber.unsubscribe = () => {
        xhr.abort();
        oldUnsubscribe.call(subscriber);
      };
      (subscriber as any).cancel = () => xhr.abort();
      this.sendXhr(xhr, method, url, params, headers);
    });
  }
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
  sendXhr(
    xhr: XMLHttpRequest,
    method: HttpMethod,
    url: string,
    params: Params,
    headers?: Headers,
  ) {
    let sendBody: any = "";
    if (this.isUrlMethod(method)) {
      xhr.open(method.toUpperCase(), url + queryStringify(params));
    } else {
      sendBody = params;
      xhr.open(method.toUpperCase(), url);
    }
    headers = headers || {};
    if (!headers["Content-Type"])
      headers["Content-Type"] = defineContentType(method);

    this.assemblyHeader(xhr, headers);
    xhr.send(sendBody);
  }
}
