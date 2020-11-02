http请求库
---

高级功能
- [请求头配置](./header.md)
- [请求预处理](./handler.md)
- [请求缓存](./cache.md)
- [API](./api.md)
- [Rxjs联合用法进阶](./rxjs.md)

### 简单使用方法

```javascript
import {http} from "@voyo/http";

http.setHost("https://www.voyo-http.com"); //设置全局访问域名地址

//使用observable 接受结果
http.xhr('post','/query/user')
    .subscribe(result=>{
      console.log(result); //此处获取返回结果
    },err=>{
      console.error(err);  //此处获取错误
    });
//使用promise接受结果
http.xhr('post','/query/user')
    .toPromise()
    .then(result=>{
      console.log(result);  //使用正常promise方式获取到结果.  
})
    

```

各类请求
---

#### get请求
http.xhr(method,relativeUrl,queryParams);
```javascript
http.xhr("get","/query/user",{name:'name',age:12}); 

// 将发送请求为 https://www.voyo-http.com/query/user?name=name&age=12;

```
#### post请求
http.xhr(method,relativeUrl,requestBody);
```javascript

http.xhr("post","/update/user",{name:'name',age:2});
// 将发送请求为 https://www.voyo-http.com/update/user
/** request body 为
*  {name : 'name', age:2}
*/
```

#### 使用绝对路径请求
```javascript
http.xhr("post","http://my-origin/xxx",{},{root:true})
// 滴四个参数 {root:true} 将使用忽略已配置的hostPath,使用绝对路径进行请求。
```

#### form表单提交
```javascript
const formDate=new FormDate();
formDate.append("key1","value");
formDate.append("key2","value");
http.xhr("postForm","/putForm",formDate);
```

#### 流提交
```javascript
http.xhr("postStream","/streamUpload",ArrayBuffer | Blob);
```