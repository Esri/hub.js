/**
 * Add protocol or upgrade http to https
 * @param {string} url
 */
export function upgradeProtocol(url: string): string {
  if (url.indexOf("http") === -1) {
    return `https://${url}`;
  } else if (url.indexOf("http://") !== -1) {
    return url.replace(/^http:/i, "https:");
  }
  return url;
}
