
#### 设置最多重试5次
```js
http.xhr(...)
    .pipe(retry(5))
    .subscribe(...)
```
#### 延时100毫秒发起请求
```js
http.xhr(...)
    .pipe(delay(100))
    .subscribe(...)
```
#### 设置请求超时时间为4000ms
```js
http.xhr(...)
    .pipe(timeout(4000))
    .subscribe(()=>{},err=>{})
```

#### 合并三个请求
```js
const a=http.xhr(...)
const b=http.xhr(...)
const c=http.xhr(...)
forkJoin({
    a,b,c
}).subscribe(({a,b,c})=>console.log(a,b,c));
```

#### 抓取错误后发起其他请求,再重新请求
```javascript
http.xhr("post","a")
    .pipe(catchError(errResult=>{   
      return http.xhr("post","b").pipe(
          mergeMap(()=>http.xhr("post","a"))
       )
    }))
```

#### 请求防抖
```javascript
http.xhr(...)
    .pipe(debounceTime(300))
```