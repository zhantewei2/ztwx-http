import {
  HttpCommonErrorType,
  HttpHeaders,
  HttpMethod,
} from "../types/http-base.type";

export class Response {
  status: number;
  method: HttpMethod;
  headers: HttpHeaders;
  result: BodyInit; // result of request
  xhr?: XMLHttpRequest;
}
