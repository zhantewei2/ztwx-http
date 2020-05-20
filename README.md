Install
---
```
npm install @ztwx/http
```

Usage
---

```
import {Http} from "@ztwx/http";

const http=new Http();

//get
http.xhr("get","http://localhost:3000",{p:1})
    .subscribe(
        result=>{},
        err=>{}
    )
//post
http.xhr("post","http://localhost:3000",{p:1})
    .subscribe(
        result=>{},
        err=>{}
    )
```

Capacity
---

- **Auto prevent duplicate request**. 

If the request is progress.
The same request will prevent the previous `Subscription`, 
and only newly created `subscription` are retained.

During this process.
There is always only one HTTP request.
   
- `cacheXhr` cache request.

Create a cache request. You can get data from cache, if the cache does not expire.
[API cacheXhr](#cacheXhr)

API
---
### Http
- setTicketKey
    - Set one global http header as a ticket key.
- setTicketValue
- **setHost**  
    - Set a fixed host url,so that you can use relative paths.
- setBeforeHandler
    - handle params before request.
- setAfterHandler
    - handle result after request.

##### setAfterHandler 
usage
```
type AfterFn = (afterFnParams: AfterFnParams) => Promise<any>;

setAfterHandler=(fn: AfterFn)=>void;
```
example

This is an example of dealing with session expiration.
Automatically fetching the session, and resending the request.

```js
const getSession=http.xhr("post","/session");
const handleSession=()=>{}
http.setAfterHandler(
    ({result,retry})=>{
        return new Promise((resolve,reject))=>{
            if(result.content==="expire"){
              getSession()
                .pipe(
                  mergeMap((sessionResult)=>{
                      handleSession(sessionResult);
                      return retry
                  })
                ).subscribe((newResult)=>resolve(newResult))
            }else{
               resolve(result);
            }
       }
    }
)

```

### Http.xhr
```
http.xhr(
    HttpMethod,
    relativeUrl,
    Params,
    Params2
)

```

### <span id="cacheXhr">Http.cacheXhr</span>
usage
```
http.cacheXhr=(p:HttpCacheXhr)=>Observable;
```
##### HttpCacheXhr
- method: HttpMethod
- relativeUrl: string
- cacheKey?: string
- params?: Params
- params2?: Params2
- expires?: number
    - Destroy the cache when it expires
- destroyOnXhr?: Array<string |RegExp>
    - Destroy the cache when a matching `url` request is triggered.
    
RXJS
---
retry request
```js
http.xhr(...)
    .pipe(retry(5))
    .subscribe(...)
```
toPromise
```js
http.xhr(...)
    .toPromise()
    .then(...)
```
delay request 
```js
http.xhr(...)
    .pipe(delay(100))
    .subscribe(...)
```
timeout request
```js
http.xhr(...)
    .pipe(timeout(4000))
    .subscribe(()=>{},err=>{})
```
forkJoin multiple request
```js
const a=http.xhr(...)
const b=http.xhr(...)
const c=http.xhr(...)
forkJoin({
    a,b,c
}).subscribe(v=>console.log(v);
// Logs:
// {a:xxx,b:xxx,c:xxx}
```
