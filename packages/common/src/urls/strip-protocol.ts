/**
 * Remove protocol if present
 * @param {string} hostname Hostname
 */
export function stripProtocol(hostname: string): string {
  hostname = hostname.toLowerCase();
  if (hostname.includes("//")) {
    hostname = hostname.split("//")[1];
  }
  return hostname;
}
