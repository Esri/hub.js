import { IDiscussionsRequestOptions } from "./types";
import { apiRequest, authenticateRequest } from "./utils/request";

/**
 * method that authenticates and makes requests to Discussions API
 *
 * @export
 * @template T
 * @param {string} url
 * @param {IDiscussionsRequestOptions} options
 * @return {*}  {Promise<T>}
 */
// NOTE: feasibly this could be replaced with @esi/hub-common hubApiRequest,
// if that method didn't prepend `/api/v3` to the supplied path. Additionally,
// there is the difference that hubApiRequest sets Authorization header without `Bearer`
// https://github.com/Esri/hub.js/blob/f35b1a0a868916bd07e1dfd84cb084bc2c876267/packages/common/src/request.ts#L62
export function request<T>(
  url: string,
  options: IDiscussionsRequestOptions
): Promise<T> {
  return authenticateRequest(options).then((token) => {
    return apiRequest(url, options, token);
  });
}
