const http=require("http");

http.createServer((req,res)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS,GET");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Headers","*");
    let buffer;
    res.setHeader("ztwx","xx");
    req.on("data",chunk=>{
        buffer?Buffer.concat(buffer,chunk):(buffer=chunk);
    });
    req.on("end",()=>{
        res.end(JSON.stringify({"result":"hello"}));
    })
}).listen(3000);
