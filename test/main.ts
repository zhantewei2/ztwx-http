import { AfterFnParams, http } from "../package/index";
import { mergeMap } from "rxjs/operators";

http.setHost("http://localhost:3000");

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
    if (!once) {
      once = true;
      getSession()
        .pipe(
          mergeMap((session) => {
            /**
             * handle session
             */
            return retry;
          }),
        )
        .subscribe(() => {
          resolve(result);
        });
    } else {
      resolve(result);
    }
  });
});
http.xhr("get", "/", { name: 1 }).subscribe((result) => {
  console.log(result);
});
