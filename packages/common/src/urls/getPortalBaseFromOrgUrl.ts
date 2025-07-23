/**
 * Given an org url, get the portal base url
 *
 * i.e. https://myorg.maps.arcgis.com will return https://www.arcgis.com
 *
 * @param orgUrl
 * @returns
 */
export function getPortalBaseFromOrgUrl(orgUrl: string): string {
  // strip off the /sharing/rest part of the url
  // this will also handle enterprise urls
  let result = orgUrl.split("/sharing/rest")[0];

  if (/(qaext|\.mapsqa)\.arcgis.com/.exec(orgUrl)) {
    result = "https://qaext.arcgis.com";
  } else if (/(devext|\.mapsdevext)\.arcgis.com/.exec(orgUrl)) {
    result = "https://devext.arcgis.com";
  } else {
    /* istanbul ignore else */
    if (/(www|\.maps)\.arcgis.com/.exec(orgUrl)) {
      result = "https://www.arcgis.com";
    }
  }

  return result;
}
