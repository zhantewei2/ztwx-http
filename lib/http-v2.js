"use strict";
// import { Observable, from } from "rxjs";
// import {
//   HttpV2Interface,
//   HttpInterceptor,
//   HttpAllParams,
//   PreRequestFn,
//   CompleteResultFn,
//   PipeHandleFn,
//   HttpVoyoRequest,
//   CompleteResultParams,
// } from "./interceptor/interceptor.interface";
// import { Http } from "./http";
// import { HttpCacheXhr, HttpMethod, Params, Params2 } from "./interface";
// import { HttpVoyoRequestEntity } from "./interceptor/http-request";
// import { mergeMap } from "rxjs/operators";
//
// export class HttpV2 extends Http implements HttpV2Interface {
//   interceptorList: HttpInterceptor[] = [];
//   preRequestCallList: Array<PreRequestFn> = [];
//   completeResultCallList: CompleteResultFn<any>[] = [];
//   pipeHandleFnCallList: PipeHandleFn[] = [];
//
//   registryInterceptor(interceptor: HttpInterceptor) {
//     this.interceptorList.push(interceptor);
//     if (interceptor.preRequest)
//       this.preRequestCallList.push((req) => {
//         // @ts-ignore
//         return interceptor.preRequest(req);
//       });
//   }
//   createRequest(params: HttpAllParams): HttpVoyoRequestEntity {
//     return new HttpVoyoRequestEntity(params);
//   }
//
//   async preRequestTap(
//     requestEntity: HttpVoyoRequest,
//   ): Promise<HttpVoyoRequest> {
//     let entity: HttpVoyoRequest | null | false | undefined = requestEntity;
//     for (const interceptor of this.interceptorList) {
//       if (interceptor.preRequest) {
//         entity = await interceptor.preRequest(requestEntity);
//         if (!entity) throw { filterRequest: requestEntity };
//       }
//     }
//     return entity;
//   }
//
//   async completeResultTap<T>({
//     retry,
//     result,
//     req,
//   }: CompleteResultParams<T>): Promise<T> {
//     for (const interceptor of this.interceptorList) {
//       if (interceptor.completeResult) {
//         result = await interceptor.completeResult({
//           retry,
//           result,
//           req,
//         });
//       }
//     }
//     return result;
//   }
//
//   sendXhr(
//     sendFn: (httpReq: HttpVoyoRequest) => Observable<any>,
//     httpAllParams: HttpAllParams,
//   ) {
//     const requestEntity = this.createRequest(httpAllParams);
//     let httpReqAfter: HttpVoyoRequest;
//     const subscriptionReq = from(this.preRequestTap(requestEntity)).pipe(
//       mergeMap((httpReq: HttpVoyoRequest) => {
//         httpReqAfter = httpReq;
//         return sendFn(httpReq);
//       }),
//       mergeMap((result) => {
//         return from(
//           this.completeResultTap({
//             req: requestEntity,
//             result,
//             retry: () => {
//               //@ts-ignore
//               if (params2.retryCurrent > params2.retryMax) {
//                 throw { overMax: true };
//               }
//               return sendFn(httpReqAfter);
//             },
//           }),
//         );
//       }),
//     );
//   }
//
//   xhr = (
//     method: HttpMethod,
//     relativeUrl: string,
//     params?: Params,
//     params2?: Params2,
//   ): Observable<any> => {
//     return this.sendXhr(
//       (httpReq) => {
//         //@ts-ignore
//         return super.xhr(
//           httpReq.method,
//           httpReq.relativeUrl,
//           httpReq.params,
//           httpReq.params2,
//         );
//       },
//       { method, relativeUrl, params, params2 },
//     );
//   };
//   cacheXhr = (params: HttpCacheXhr) => {
//     return this.sendXhr((httpReq: HttpVoyoRequest) => {
//       //@ts-ignore
//       return super.cacheXhr(httpReq);
//     }, params);
//   };
// }
