import { getProp } from "../../objects";
import { IHubRequestOptions } from "../../types";

interface IHeaders {
  Authorization?: string;
  [key: string]: string;
}

/**
 * Construct the auth header from a hub request options
 * @param {IHubRequestOptions} hubRequestOptions
 * @private
 */
export function _getAuthHeader(
  hubRequestOptions: IHubRequestOptions
): IHeaders {
  const result: IHeaders = {};
  const token = getProp(hubRequestOptions, "authentication.token");
  if (token) {
    result.Authorization = token;
  }
  return result;
}
