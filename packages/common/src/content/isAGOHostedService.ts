function getHostname(url: string): string {
  const urlObj = new URL(url);
  return urlObj.hostname;
}

/**
 * Used to determine if a service is hosted on ArcGIS Online
 *
 * Includes exlusion logic that prevents (secured) proxied services from returning true
 * as we can't be sure if they are hosted or not
 * @param url
 * @returns true if the url is an ArcGIS Online hosted service
 */
/* istanbul ignore next - fn copied from another location that has tests */
export function isAGOHostedService(url: string): boolean {
  let origin = getHostname(url); // -> www.esri.com

  if (!origin) {
    return false;
  }

  origin = origin.toLowerCase();

  // This function will return _true_ if the url points to a hosted service in ArcGIS Online.
  // It will return _false_ for proxy services (i.e., a proxy set up by AGO to access secure
  // services that require credentials).
  // NOTE: Even if a proxy is delegating to hosted feature service, this util will return false.
  // We have no way of identifying what kind of service a proxy represents.
  return (
    origin.endsWith(".arcgis.com") &&
    (origin.startsWith("services") ||
      origin.startsWith("tiles") ||
      origin.startsWith("features"))
  );
}
