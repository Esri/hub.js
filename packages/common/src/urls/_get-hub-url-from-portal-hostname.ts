/**
 * Parse the portal url, and if it matches one of the AGO
 * Url patterns, return the correct Hub Url
 * If portalUrl does not match an AGO pattern, this will
 * return `undefined`
 * @param portalUrl
 * @private
 */
export function _getHubUrlFromPortalHostname(portalUrl: string): string {
  let result;

  if (/(qaext|\.mapsqa)\.arcgis.com/.exec(portalUrl)) {
    result = "https://hubqa.arcgis.com";
  } else if (/(devext|\.mapsdevext)\.arcgis.com/.exec(portalUrl)) {
    result = "https://hubdev.arcgis.com";
  } else if (/(www|\.maps)\.arcgis.com/.exec(portalUrl)) {
    result = "https://hub.arcgis.com";
  }

  return result;
}
