const http=require("http");

http.createServer((req,res)=>{
    console.log(req.headers)
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
    res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS,GET");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Headers","content-type,ztwx-auth");
    let buffer;
    res.setHeader("ztwx","xx");
    req.on("data",chunk=>{
        buffer?Buffer.concat(buffer,chunk):(buffer=chunk);
    });
    req.on("end",()=>{
        res.end(JSON.stringify({"result":"hello"}));
    })
}).listen(5000);
