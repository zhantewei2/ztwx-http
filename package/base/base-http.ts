import {
  HttpMethod,
  Params,
  RequestResult,
  Headers,
  BaseHttpInterface,
} from "../interface";
import { Subscriber, Observable } from "rxjs";
import { error, isUni } from "../utils";
import { defineContentType } from "./define-content-type";
import { BaseCapacity } from "./base";
import { BaseHttpUniapp } from "./base-http-uniapp";

export const queryStringify = (obj: Params) => {
  if (!obj) return "";
  let str = "?";
  for (const i in obj) {
    str += i + "=" + obj[i] + "&";
  }
  return str.slice(0, -1);
};

export class BaseHttpXhr extends BaseCapacity implements BaseHttpInterface {
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
          }
          subscriber.complete();
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

  private sendXhr(
    xhr: XMLHttpRequest,
    method: HttpMethod,
    url: string,
    params: Params,
    headers?: Headers,
  ) {
    let sendBody: any = "";
    const { contentType, targetMethod } = defineContentType(method);
    if (this.isUrlMethod(targetMethod)) {
      xhr.open(targetMethod.toUpperCase(), url + queryStringify(params));
    } else {
      sendBody = params;
      xhr.open(targetMethod.toUpperCase(), url);
    }
    headers = headers || {};
    if (!headers["Content-Type"]) headers["Content-Type"] = contentType;
    this.assemblyHeader(xhr, headers);
    xhr.withCredentials = true;
    xhr.send(sendBody);
  }
}

export const BaseHttp = isUni() ? BaseHttpUniapp : BaseHttpXhr;
