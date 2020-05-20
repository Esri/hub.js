

/**
 * Parse the portal url, and if it matches one of the AGO
 * Url patterns, return the correct Hub Url 
 * If portalUrl does not match an AGO pattern, this will
 * return `undefined`
 * @param portalUrl 
 */
export function _getHubUrlFromPortalHostname(portalUrl:string): string {
  let result = undefined;
  
  if (portalUrl.match(/(qaext|\.mapsqa)\.arcgis.com/)) {
    result = "https://hubqa.arcgis.com";
  } else if (portalUrl.match(/(devext|\.mapsdevext)\.arcgis.com/)) {
    result = "https://hubdev.arcgis.com";
  } else if (portalUrl.match(/(www|\.maps)\.arcgis.com/)) {
    result = "https://hub.arcgis.com";
  } 

  return result;
}