import { VoyoHttp } from "../package/index";

document.body.innerHTML = `
<div>
    <button id="sendBtn">send</button>    
</div>
`;
const sendBtn: HTMLElement = document.body.querySelector(
  "#sendBtn",
) as HTMLElement;

const http = new VoyoHttp({});

http.initPlugin();
http.setHost("http://localhost:5000");
http.setGlobalHeader("ztwx-auth", "ztwx", 1);

sendBtn.onclick = () => {
  http
    .xhr({
      method: "post",
      path: "/bibi",
      json: {
        xx: "xxxx",
      },
    })
    .subscribe(({result,statusCode}) => {
      console.log(result);
    });
};
