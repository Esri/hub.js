/**
 * Checks if a URL is an ArcGIS Enterprise portal URL, by checking if it
 * starts with https:// has one or more subdomains before arcgis.com.
 * If it does, then it is NOT an Enterprise portal URL.
 * @param url The URL to check.
 * @returns True if the URL is an Enterprise portal URL, false otherwise.
 */
export function isEnterprisePortalUrl(url: string): boolean {
  if (!url || typeof url !== "string") {
    return false;
  }
  // Return false if the url does not start with "https://"
  if (!url.startsWith("https://")) {
    return false;
  }
  const isEnterpriseUrlRegex = /^https?:\/\/([^.]+\.)*arcgis\.com(\/|$)/i;
  return !isEnterpriseUrlRegex.test(url);
}
