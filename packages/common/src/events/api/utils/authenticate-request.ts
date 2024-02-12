import { IEventsRequestOptions } from "../types";

/**
 * return a token created using options.authentication or set on options.token
 *
 * @export
 * @param {IDiscussionsRequestOptions} options
 * @return {*}  {Promise<string>}
 */
export function authenticateRequest(
  options: IEventsRequestOptions
): Promise<string> {
  const { token, authentication } = options;

  if (authentication) {
    return authentication.getToken(authentication.portal);
  }

  return Promise.resolve(token);
}
