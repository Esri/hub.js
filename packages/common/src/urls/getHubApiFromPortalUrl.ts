/**
 * Cross-walk from a portalUrl to the corresponding Hub API Url
 *
 * If the passed url is not recognized, then this will return `undefined`
 * @param portalUrl
 * @returns
 */

export function getHubApiFromPortalUrl(portalUrl: string): string {
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
