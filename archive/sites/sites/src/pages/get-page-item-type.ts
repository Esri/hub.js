/**
 * The item type depends if the app is running
 * in ArcGIS Enterprise vs AGO
 * @param {boolean} isPortal Is this running in Enterprise?
 */
export function getPageItemType(isPortal: boolean) {
  let type = "Hub Page";
  if (isPortal) {
    type = "Site Page";
  }
  return type;
}
