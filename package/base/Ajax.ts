import { Http, HttpTransmitter } from "./Http";
import {
  xhrAssemblyHeader,
  arrRunAsync,
  responseHeaderToDict,
  patchUnsubscribe,
} from "../utils/utils";
import { Observable } from "rxjs";
import { HttpCommonError } from "../types/http-base.type";
import { HttpSuccessResult } from "../types/http-params.type";

export class Ajax implements HttpTransmitter {
  xhr: XMLHttpRequest;

  /**
   * Making an Ajax request
   */
  start(http: Http): Observable<HttpSuccessResult> {
    return new Observable<HttpSuccessResult>((ob) => {
      const xhr = new XMLHttpRequest();
      const { req, res, hooks } = http;
      arrRunAsync([
        (next) => {
          /**
           * life Hook
           * @preHandler
           */
          const preHandlerParams = { target: http, xhr, req };
          hooks.preHandler && hooks.preHandler.call(http, preHandlerParams);
          hooks.preHandlerAsync
            ? hooks.preHandlerAsync.call(http, preHandlerParams).then(next)
            : next();
        },
        (next) => {
          /**
           * config
           */
          if (req.timeout) xhr.timeout = req.timeout; // XHR timeout.
          if (req.responseType) xhr.responseType = req.responseType; // XHR responseType.
          if (req.withCredentials) xhr.withCredentials = req.withCredentials; // XHR withCredentials.
          /**
           * life Hook
           * @postHandler
           */
          if (hooks.progressHandler)
            xhr.onprogress = (progressEvent: ProgressEvent) =>
              (hooks.progressHandler as any).call(http, {
                progressEvent,
                target: http,
              });
          next();
        },
        (next) => {
          /**
           * request complete
           */
          xhr.onreadystatechange = (e) => {
            if (xhr.readyState !== 4 || xhr.status === 0) return;
            res.status = xhr.status;
            res.result = xhr.response;
            res.headers = responseHeaderToDict(xhr.getAllResponseHeaders());
            next({});
          };
          xhr.addEventListener("abort", (errorEvent) =>
            next({ errorType: "abort", errorEvent }),
          );

          xhr.addEventListener("error", (errorEvent) =>
            next({ errorType: "error", errorEvent }),
          );

          xhr.addEventListener("timeout", (errorEvent) =>
            next({ errorType: "timeout", errorEvent }),
          );

          patchUnsubscribe(ob, () => xhr.abort());
          xhr.open(req.method, req.url);
          /**
           * config headers
           */
          if (req.headers) xhrAssemblyHeader(xhr, req.headers); //Assembly http headers.
          xhr.send(req.body);
        },
        (next, error: HttpCommonError) => {
          /**
           * life Hook
           * @afterCompletion
           */
          const afterCompletionParams = {
            target: http,
            res,
            req,
            ...error,
          };
          http.errorEvent = error.errorEvent;
          http.errorType = error.errorType;
          hooks.afterCompletion &&
            hooks.afterCompletion.call(http, afterCompletionParams);
          hooks.afterCompletionAsync
            ? hooks.afterCompletionAsync
                .call(http, afterCompletionParams)
                .then(next)
            : next();
        },
        (next) => {
          if (http.errorType) {
            /**
             * life Hook
             * @errorTrigger
             */
            hooks.errorTrigger &&
              hooks.errorTrigger({
                errorType: http.errorType,
                errorEvent: http.errorEvent,
                target: http,
              });
            ob.error({ http });
          } else {
            ob.next({ http });
          }
          ob.complete();
        },
      ]);
    });
  }
}
