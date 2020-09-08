import { BaseHttp } from "./base-http";
import { HttpMethod, Params, Headers, RequestResult } from "../interface";
import { allOneManage, QueueItem } from "./all-one-manage";
import { Observable, Subject, Subscriber, Subscription } from "rxjs";

export interface AllOneSendOpts {
  method: HttpMethod;
  url: string;
  params: Params;
  headers?: Headers;
  key?: string;
}

export class AllOneHttp extends BaseHttp {
  /***
   * generate unique key
   * @param key
   * @param method
   * @param url
   * @param params
   */
  generateKey(
    key: string | undefined,
    method: HttpMethod,
    url: string,
    params: Params,
  ) {
    if (key) return key;
    if (this.isJsonMethod(method)) {
      return (
        method + "--" + url + "--" + (params ? JSON.stringify(params) : "")
      );
    } else {
      return url;
    }
  }

  xhr = ({
    method,
    url,
    params,
    headers,
    key,
  }: AllOneSendOpts): Observable<RequestResult> => {
    const xhrKey = this.generateKey(key, method, url, params);
    const existXhr: QueueItem | undefined = allOneManage.exists(xhrKey);
    return new Observable((ob: Subscriber<RequestResult>) => {
      const handleEnd = () => {
        allOneManage.remove(xhrKey);
      };
      const handleResult = (result: RequestResult) => {
        handleEnd();
        ob.next(result);
        ob.complete();
      };
      const handleError = (err: any) => {
        handleEnd();
        ob.error(err);
      };
      let runningSubscription: Subscription;
      if (existXhr) {
        existXhr.subscription.unsubscribe();
        existXhr.subscription = existXhr.observer.subscribe(
          (result) => handleResult(result),
          (err) => handleError(err),
        );
        runningSubscription = existXhr.oneSubscription;
      } else {
        const subject: Subject<RequestResult> = new Subject<RequestResult>();
        const newSubscription = subject.subscribe(
          (result) => handleResult(result),
          (err) => handleError(err),
        );
        runningSubscription = super
          .send(method, url, params, headers)
          .subscribe(
            (result) => subject.next(result),
            (err) => subject.error(err),
          );

        allOneManage.append(
          xhrKey,
          subject,
          newSubscription,
          runningSubscription,
        );
      }
      const oldUnsubscribe = ob.unsubscribe;
      ob.unsubscribe = () => {
        runningSubscription.unsubscribe();
        handleEnd();
        oldUnsubscribe.call(ob);
      };
    });
  };
}
