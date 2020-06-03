import { HttpMethod } from "../interface";

export const defineContentType = (
  method: HttpMethod,
): { targetMethod: HttpMethod; contentType: string } => {
  let contentType: string;
  let targetMethod: HttpMethod = method;
  if (method === "postStream") {
    contentType = "application/octet-stream";
    targetMethod = "post";
  } else if (method === "postForm") {
    contentType = "application/x-www-form-urlencoded";
    targetMethod = "post";
  } else {
    contentType = "application/json";
  }
  return { targetMethod, contentType };
};
