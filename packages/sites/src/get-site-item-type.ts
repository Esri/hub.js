/**
 * The item type depends if the app is running
 * in ArcGIS Enterprise vs AGO
 * @param {boolean} isPortal Is this running in Enterprise?
 */
export function getSiteItemType(isPortal: boolean) {
  let type = "Hub Site Application";
  if (isPortal) {
    type = "Site Application";
  }
  return type;
}
