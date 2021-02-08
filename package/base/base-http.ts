import {
  HttpMethod,
  Params,
  RequestResult,
  Headers,
  BaseHttpInterface,
  HttpRequestLib,
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
  xhr: XMLHttpRequest;
  send(
    method: HttpMethod,
    url: string,
    params: Params,
    headers?: Headers,
    withCredentials?: boolean,
    responseType?: XMLHttpRequestResponseType,
  ): Observable<RequestResult> {
    const xhr = new XMLHttpRequest();
    if (responseType) xhr.responseType = responseType;
    return new Observable((subscriber: Subscriber<any>) => {
      xhr.onload = () => {
        this.setXhr(xhr);
        if (xhr.readyState == 4) {
          if (xhr.status === 0) {
            error(`connect failure...address: ${url}`);
            subscriber.error({ status: 0, content: "connect failure" });
          } else {
            let resultContent: any;

            if (responseType && responseType !== "text") {
              resultContent = xhr.response;
            } else {
              try {
                resultContent = JSON.parse(xhr.responseText);
              } catch (e) {
                resultContent = xhr.responseText;
              }
            }

            subscriber.next({
              status: xhr.status,
              content: resultContent,
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
      this.sendXhr(xhr, method, url, params, headers, withCredentials);
    });
  }

  private sendXhr(
    xhr: XMLHttpRequest,
    method: HttpMethod,
    url: string,
    params: Params,
    headers?: Headers,
    withCredentials?: boolean,
  ) {
    let sendBody: any = "";
    const { contentType, targetMethod } = defineContentType(method);
    if (this.isUrlMethod(targetMethod)) {
      xhr.open(targetMethod.toUpperCase(), url + queryStringify(params));
    } else {
      if (contentType === "application/json") {
        try {
          sendBody = JSON.stringify(params);
        } catch (e) {
          sendBody = params;
        }
      } else {
        sendBody = params;
      }
      xhr.open(targetMethod.toUpperCase(), url);
    }
    headers = headers || {};
    if (!headers["Content-Type"] && contentType)
      headers["Content-Type"] = contentType;
    this.assemblyHeader(xhr, headers);
    xhr.withCredentials = !!withCredentials;
    xhr.send(sendBody);
  }

  private setXhr(xhr: XMLHttpRequest) {
    this.xhr = xhr;
  }

  getResponseHeader(key: string) {
    return this.xhr.getResponseHeader(key);
  }
}

export const BaseHttp = isUni() ? BaseHttpUniapp : BaseHttpXhr;

export const getBaseHttp = (requestLib: HttpRequestLib): any => {
  if (requestLib === "auto") {
    return isUni() ? BaseHttpUniapp : BaseHttpXhr;
  } else if (requestLib === "uni") {
    return BaseHttpUniapp;
  } else {
    return BaseHttpXhr;
  }
};
