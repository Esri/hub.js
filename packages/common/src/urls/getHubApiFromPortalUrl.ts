/**
 * Cross-walk from a portalUrl to the corresponding Hub API Url
 *
 * If the passed url is not recognized, then this will return `undefined`
 * @param portalUrl
 * @returns
 */

export function getHubApiFromPortalUrl(portalUrl: string): string {
  let result;

  if (portalUrl.match(/(qaext|\.mapsqa)\.arcgis.com/)) {
    result = "https://hubqa.arcgis.com";
  } else if (portalUrl.match(/(devext|\.mapsdevext)\.arcgis.com/)) {
    result = "https://hubdev.arcgis.com";
  } else if (portalUrl.match(/(www|\.maps)\.arcgis.com/)) {
    result = "https://hub.arcgis.com";
  }

  return result;
}
