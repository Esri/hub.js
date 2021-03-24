import { HubProduct, IGroupTemplate } from "../types";
import { cloneObject } from "@esri/hub-common";
import { WELLKNOWNTEAMS } from "../well-known-teams";
import { PRE_9_1_WELLKNOWNTEAMS } from "../pre-9-1-well-known-teams";

/**
 * Given a product, return the groups templates that are available
 * @param {string} product Product name portal | basic | premium
 */
export function getTeamsAvailableInProduct(
  product: HubProduct,
  portalApiVersion: string
) {
  // TODO: remove this when needed
  // choosing the type of well known team based on the current portal version
  const teams =
    parseFloat(portalApiVersion) < 9.1
      ? PRE_9_1_WELLKNOWNTEAMS
      : WELLKNOWNTEAMS;
  const filterFn = (tmpl: IGroupTemplate) => {
    return tmpl.config.availableIn.indexOf(product) > -1;
  };
  return cloneObject(teams).filter(filterFn);
}
