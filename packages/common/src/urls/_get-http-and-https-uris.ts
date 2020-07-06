/**
 * Given a url without a protocol or with either http or https, return an array
 * that contains both the http and https version
 * @param {string} uri Url with either http or https, or no protocol
 * @private
 */
export function _getHttpAndHttpsUris(uri: string) {
  if (!uri) {
    return [];
  }
  const domain = uri.replace(/^http(s?):\/\//, "");
  return [`http://${domain}`, `https://${domain}`];
}
