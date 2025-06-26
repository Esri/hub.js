import {
  ArcGISIdentityManager,
  IRequestOptions,
} from "@esri/arcgis-rest-request";
import { cloneObject } from "../../../util";
import { IHubSearchResponse } from "../../types/IHubSearchResponse";
import { IPagingParams } from "@esri/arcgis-rest-portal";

type ICommonNextOptions = IRequestOptions & IPagingParams;

/**
 * @private
 * Create a `.next()` function for portal search type
 * @param request
 * @param nextStart
 * @param total
 * @param fn
 * @returns
 */
export function getNextPortalCallback<I extends ICommonNextOptions, O>(
  request: I,
  nextStart: number,
  total: number,
  fn: (r: I) => Promise<IHubSearchResponse<O>>
): () => Promise<IHubSearchResponse<O>> {
  const clonedRequest = cloneObject(request);

  // clone will not handle authentication so we do it manually
  if (request.authentication) {
    clonedRequest.authentication = ArcGISIdentityManager.deserialize(
      (request.authentication as ArcGISIdentityManager).serialize()
    );
  }

  // figure out the start
  clonedRequest.start = nextStart > -1 ? nextStart : total + 1;

  return (): Promise<IHubSearchResponse<O>> => fn(clonedRequest);
}
