export function getHostname(url: string): string {
  const urlObj = new URL(url);
  return urlObj.hostname;
}

/* istanbul ignore next - fn copied from another location that has tests */
export function isHostedAgolService(url: string): boolean {
  let origin = getHostname(url); // -> www.esri.com

  if (!origin) {
    return false;
  }

  origin = origin.toLowerCase();

  // unfortunately, when a service is proxied and requires credentials, we have no way of knowing if it's hosted or not
  // ... meaning that we are returning false for all services that are proxied
  return (
    origin.endsWith(".arcgis.com") &&
    (origin.startsWith("services") ||
      origin.startsWith("tiles") ||
      origin.startsWith("features"))
  );
}
