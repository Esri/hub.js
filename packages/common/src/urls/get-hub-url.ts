import { IPortal } from "@esri/arcgis-rest-portal";
import { HUB_URLMAP } from './hub-urlmap';

/**
 * Return the Hub Url based on the portal self
 * @param portal 
 */
export function getHubUrl (portal: IPortal) : string {
  if (portal.isPortal) {
    throw new Error(`Hub Url is not available in ArcGIS Enterprise`);
  } else {
    const index: "devext" | "qaext" | "www" = portal.portalHostname.split(
      "."
    )[0];
    return HUB_URLMAP[index] || HUB_URLMAP.www;
  }
}