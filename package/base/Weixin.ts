import { Http, HttpTransmitter } from "./Http";
import { arrRunAsync } from "../utils/utils";
import { Observable } from "rxjs";
import { HttpCommonError } from "../types/http-base.type";
import { HttpSuccessResult } from "../types/http-params.type";

declare const wx: any;

export class Weixin implements HttpTransmitter {
  tool: any;
  constructor(tool: any = wx) {
    this.tool = tool;
  }
  /**
   * Making an Ajax request
   */
  start(http: Http): Observable<HttpSuccessResult> {
    return new Observable<HttpSuccessResult>((ob) => {
      const { req, res, hooks } = http;
      const requestParams: any = {};
      arrRunAsync([
        (next) => {
          /**
           * life Hook
           * @preHandler
           */
          const preHandlerParams = { target: http, req };
          hooks.preHandler && hooks.preHandler.call(http, preHandlerParams);
          hooks.preHandlerAsync
            ? hooks.preHandlerAsync.call(http, preHandlerParams).then(next)
            : next();
        },
        (next) => {
          /**
           * config
           */
          if (req.timeout) requestParams.timeout = req.timeout; // XHR timeout.
          if (req.responseType) {
            // XHR responseType.
            if (req.responseType === "json") {
              requestParams.responseType = "text";
              requestParams.dataType = "json";
            } else if (req.responseType === "text") {
              requestParams.responseType = "text";
              requestParams.dataType = undefined;
            } else {
              requestParams.responseType = "arraybuffer";
              requestParams.dataType = undefined;
            }
          }
          /**
           * life Hook
           * @postHandler
           */
          //progress not work!
          next();
        },
        (next) => {
          /**
           * request complete
           */

          const task: any = this.tool.request({
            ...requestParams,
            method: req.method,
            url: req.url,
            header: req.headers || {},
            data: req.body,
            success(result: any) {
              res.status = result.statusCode;
              res.result = result.data;
              res.headers = result.header;
              next({});
            },
            fail(e: { errMsg: string }) {
              const errorType =
                e.errMsg.indexOf("timeout") >= 0
                  ? "timeout"
                  : e.errMsg.indexOf("abort") >= 0
                  ? "abort"
                  : "error";
              next({
                errorType,
                errorEvent: e as any,
              });
            },
          });
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
