import { AfterFnParams, http } from "../package/index";
import { mergeMap } from "rxjs/operators";

http.setHost("http://www.gohuike.com");

http.setBeforeHandler((params) => {
  if (params) params.name = 2;
});

const getSession = () => http.xhr("get", "/session");

let once = false;
http.setAfterHandler(({ params, result, retry }: AfterFnParams) => {
  console.log("send after");
  return new Promise<any>((resolve, reject) => {
    /**
     * if session expires ..we can grab session and resend the request
     */
    resolve(result);
  });
});
http.xhr("get", "/api/weixin/common/queryKeyValueOne", { code: 'jd' }).subscribe((result) => {
  console.log(result);
});
