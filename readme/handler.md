请求预处理
---
结果处理
```
/**
*
* retry 为当前发起的请求，retry()可以重新发起该请求。
*/
http.setAfterHandler(({ params, result, retry }: AfterFnParams) => {
  return new Promise<any>((resolve, reject) => {
    /**
    * 这里可以全局处理请求结果，为全局接口返回指定的数据格式。
    * 或抛出异常
    **/
    resolve(result);
  });
});
```

请求前处理
```
commonHttp.setBeforeHandler((params, params2) => {
    /**
    * 此处可以全局处理请求前
    **/
});
```