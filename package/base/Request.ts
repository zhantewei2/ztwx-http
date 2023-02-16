import { HttpHeaders, HttpMethod } from "../types/http-base.type";

export class Request {
  method: HttpMethod;
  url: string;
  body?: BodyInit; // body parameters
  responseType: XMLHttpRequestResponseType;
  timeout: number; // timeout of request
  headers: HttpHeaders; // headers of request
  withCredentials?: boolean;
  xhr?: XMLHttpRequest;
  voyoInfo?: any; // addition info of voyo.
  mergeInfo?: any; //addition info.
  requestParams?: Record<string, any>; //addition requestParams for wx|uniApp.
}
