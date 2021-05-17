import { VoyoHttp } from "../lib/index.js";

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
http.setHost("http://localhost:3000");
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
    .subscribe((result: any) => {
      console.log(result);
    });
};
