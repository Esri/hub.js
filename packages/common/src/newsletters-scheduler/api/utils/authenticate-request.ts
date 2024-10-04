import { INewslettersSchedulerRequestOptions } from "../types";

/**
 * return a token created using options.authentication or set on options.token
 *
 * @export
 * @param {INewslettersSchedulerRequestOptions} options
 * @return {*}  {Promise<string>}
 */
export function authenticateRequest(
  options: INewslettersSchedulerRequestOptions
): Promise<string> {
  const { token, authentication } = options;

  if (authentication) {
    return authentication.getToken(authentication.portal);
  }

  return Promise.resolve(token);
}
