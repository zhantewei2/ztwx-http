#### 请求时携带请求头
```javascript

http.xhr('post','/query/user',{},{
  headers:{
    'customer-header':'--'
  }
})
// 发送`customer-header` 自定义请求头
```

### 配置全局请求头
配置一个全局的请求头，所有请求，都会携带该请求头
```
http.setGlobalHeader('globalHeader','gloabalHeaderValue');
```
该全局header请求具备第一优先级，将覆盖，请求发送的header.
```
http.setGlobalHeader('globalHeader','globalHeaderValue',true);
```