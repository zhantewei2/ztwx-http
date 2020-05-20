import { HttpMethod } from "../interface";

export const defineContentType = (method: HttpMethod): string => {
  if (method === "postStream") {
    return "application/octet-stream";
  } else if (method === "postForm") {
    return "application/x-www-form-urlencoded";
  } else {
    return "application/json";
  }
};
