请求预处理
---

```
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