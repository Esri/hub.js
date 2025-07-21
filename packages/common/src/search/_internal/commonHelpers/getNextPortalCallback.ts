import {
  ArcGISIdentityManager,
  IRequestOptions,
} from "@esri/arcgis-rest-request";
import { cloneObject } from "../../../util";
import { IHubSearchResponse } from "../../types/IHubSearchResponse";
import { IPagingParams } from "@esri/arcgis-rest-portal";
import { IHubRequestOptions } from "../../../hub-types";
import { getProp } from "../../../objects/get-prop";

type ICommonNextOptions = IRequestOptions &
  IPagingParams & {
    // The upstream `processSearchParams()` stabs this onto every request and many downstream
    // functions seem to prefer it over the top-level `authentication` property.
    requestOptions?: IHubRequestOptions;
  };

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

  // do the same workaround for requestOptions.authentication
  if (getProp(request, "requestOptions.authentication")) {
    clonedRequest.requestOptions.authentication =
      ArcGISIdentityManager.deserialize(
        request.requestOptions.authentication.serialize()
      );
  }

  // figure out the start
  clonedRequest.start = nextStart > -1 ? nextStart : total + 1;

  return (): Promise<IHubSearchResponse<O>> => fn(clonedRequest);
}
