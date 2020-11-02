#### 请求缓存

##### HttpCacheXhr API
- method: HttpMethod
- relativeUrl: string
- cacheKey?: string `可选`. 指定缓存键值.相同键值视为同一缓存对象。
- params?: Params
- params2?: [Params2](api.md#params2)
- expires?: number
    - 设置缓存时间，单位为毫秒
- destroyOnXhr?: Array<string |RegExp>
    - Destroy the cache when a matching `url` request is triggered.
    
    
##### EXAMPLE
该请求会 在内存`缓存6分钟`,6分钟内再次发起**同样地址**及**相同参数**时，会从缓存中获取数据，不会访问服务器。

```javascript
http.cacheXhr({
  method: 'post',
  relativeUrl: '/postUrl',
  params:{ postParams:'value'}, // post requestBody参数
  expires: 1000*60*6 
})
```
