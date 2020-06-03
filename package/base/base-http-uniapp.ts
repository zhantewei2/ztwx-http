import {
  BaseHttpInterface,
  HttpMethod,
  Params,
  RequestResult,
  Headers,
} from "../interface";
import { BaseCapacity } from "./base";
import { Observable } from "rxjs";
import { error } from "../utils";
import { defineContentType } from "./define-content-type";
declare const uni: any;

export class BaseHttpUniapp extends BaseCapacity implements BaseHttpInterface {
  send(
    method: HttpMethod,
    url: string,
    params: Params,
    headers?: Headers,
  ): Observable<RequestResult> {
    const { targetMethod, contentType } = defineContentType(method);

    return new Observable((ob) => {
      const reqTask = uni.request({
        url,
        method: targetMethod,
        data: params,
        withCredentials: true,
        headers: Object.assign(
          {
            "content-type": contentType,
          },
          headers || {},
        ),
        success: ({ data, statusCode, header }: any) => {
          ob.next({ status: statusCode, content: data, header });
          ob.complete();
        },
        fail: (errorResp: any) => {
          error(errorResp);
          ob.error({ status: 0, content: "connect failure" });
          ob.complete();
        },
      });

      const oldUnsub = ob.unsubscribe;
      ob.unsubscribe = () => {
        reqTask.abort();
        oldUnsub.call(ob);
      };
      (ob as any).cancel = () => reqTask.abort();
    });
  }
}
