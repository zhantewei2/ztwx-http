import { HttpHeaders } from "../types/http-base.type";
import { Observer, Subscriber } from "rxjs";

export const xhrAssemblyHeader = (xhr: XMLHttpRequest, headers: HttpHeaders) =>
  headers &&
  Object.keys(headers).forEach((key: string) =>
    xhr.setRequestHeader(key, headers[key] as any),
  );

/**
 * Do not need include babel async/await runtime polyfill..
 */
export const arrRunAsync = (
  arr: Array<(next: (nextParams?: any) => void, preParams?: any) => any>,
  params?: any,
) => {
  arr.length &&
    arr[0]((nextParams) => arrRunAsync(arr.slice(1), nextParams), params);
};

export const arrForEachAsync = (
  arr: Array<(next: () => void) => void>,
  end: () => void,
) => {
  arr.length ? arr[0](() => arrForEachAsync(arr.slice(1), end)) : end();
};

export const responseHeaderToDict = (
  responseHeaders: string,
): Record<string, any> => {
  if (!responseHeaders) return {};
  const dict: Record<string, any> = {};
  let key, value;
  responseHeaders
    .trim()
    .split(/[\r\n]+/)
    .forEach((responseHeader: any) => {
      if (!responseHeaders) return;
      [key, value] = responseHeader.split(": ");
      dict[key] = value;
    });
  return dict;
};

export const patchUnsubscribe = (ob: Subscriber<any>, patch: () => void) => {
  const _unsubscribe = ob.unsubscribe;
  ob.unsubscribe = () => {
    patch();
    _unsubscribe.call(ob);
  };
};

export const nullishCoalescing = (val: any, defaultVal: any) =>
  val === undefined || val === null ? defaultVal : val;

export const joinUrl = (url = "", path = "") =>
  (url[url.length - 1] === "/" ? url.slice(0, url.length - 1) : url) +
  (path[0] === "/" ? path : "/" + path);

export const isObject = (obj: any) =>
  Object.prototype.toString.call(obj).toLowerCase() === "[object object]";
