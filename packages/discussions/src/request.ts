import { IRequestOptions } from "./types";
import { apiRequest, authenticateRequest } from "./utils/request";

/**
 * method that authenticates and makes requests to Discussions API
 *
 * @export
 * @template T
 * @param {string} url
 * @param {IRequestOptions} options
 * @return {*}  {Promise<T>}
 */
export function request<T>(url: string, options: IRequestOptions): Promise<T> {
  return authenticateRequest(options).then(token => {
    return apiRequest(url, options, token);
  });
}
