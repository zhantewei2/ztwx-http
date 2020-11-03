http.xhr
===

```
http.xhr(
    HttpMethod,
    relativeUrl,
    Params,
    Params2
)
```

### HttpMethod 
请求方法
  | "get"
  | "post"
  | "put"
  | "delete"
  | "update"
  | "postForm"
  | "postStream";
  
### relativeUrl
请求相对路径
```
type : string
```
### Params
请求参数
```
Record<string,any>
```
### Params2
请求配置

```
  headers?: { [key: string]: any }; //请求头
  expires?: number;             // 已废弃
  key?: string;                 // 请求key值. 默认取请求地址加参数的拼接
  root?: string | boolean;      // 使用绝对路径请求. 默认false
  retryMax?: number;            // 请求最大重试次数 默认为0
  retryCurrent?: number;        // 当前已重试次数 一般由程序自动指定
  notQueue?: boolean; // not wait queue // 是否等待相同请求队列 默认为 true. 即相同请求自动队列截流
  priorityHeaders?: boolean;    // 请求头，是否覆盖全局指定的第一优先级header。 默认 false
  withCredentials?: boolean;    // 请求是否withCredentials, 默认取全局配置的withCredentials。
```
