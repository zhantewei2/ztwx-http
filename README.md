Install
---
```
npm install @voyo/http
```

Usage
---
```javascript
import {VoyoHttp} from "@voyo/http";

const http=new VoyoHttp({});
http.initPlugin();

http.xhr({
  method:"get",
  url:"http://localhost:3000/hello"
}).subscribe(
  result=>console.log(result),
  err=>console.error(err)
)
```
for weixin-mp
```javascript
import {VoyoHttp,Weixin} from "@voyo/http";

const http=new VoyoHttp({
  transmitter: new Weixin()
});
http.initPlugin();
```


Request Example
---

#### JSON

```javascript
http.xhr({
  method:"post",
  url,
  json:{
    "findId":"xxx"
  }
})
```

#### queryParams

```javascript
http.xhr({
  method:"get",
  url,
  query:{
    "findId":"xxx"
  }
})
```

#### download
```javascript
http.xhr({
  method:"post",
  url,
  responseType:"ArrayBuffer",
})
```

#### upload formData
```javascript
http.xhr({
  method:"post",
  url,
  formData
})
```

#### upload blob
```javascript
http.xhr({
  method:"post",
  url,
  blob
})
```

In Project
---
example
```javascript
import {VoyoHttp} from "@voyo/http";
const http=new VoyoHttp({});
http.initPlugin();

// configure the global requested domain.
http.setHost("http://localhost:3000");

// login example
http.xhr({
  method:"post",
  path:"/login",
  json:{
    account:"xx",
    pswd:"xx"
  }
})
.toPromise()
.then(({result,statusCode})=>{
  if(statusCode===200){
    http.setGlobalHeader("user-auth-token",result.token);
  }
})


// query example
http.xhr({
  method: "get",
  path: "/query",
  query: {id:"01"}
})
.toPromise()
.then(({result})=>{
  console.log(result);
})
```


Plugin
---
```javascript
import {VoyoHttp} from "@voyo/http";

const http=new VoyoHttp({});

http.addPlugin({
  name: PLUGIN_NAME,
  priority: PLUGIN_PRIORITY
})

http.initPlugin();
```

- VoyoHttpPlugin
```typescript
export interface VoyoHttpPlugin {
  priority: number; //Sort order
  name: string;
  patchCall?(self: any): void; //Rewrite http.
  before?(params: HttpBeforeParams): Promise<void>; // Http hook.
  registryHooks?(params: HttpApplyParams): void; // Http basic life hooks.
  after?(params: HttpAfterParams): Promise<void>; // Http hook
  wrapper?(params: HttpWrapperParams): Observable<HttpSuccessResult>; // Observer hook;
}
```

