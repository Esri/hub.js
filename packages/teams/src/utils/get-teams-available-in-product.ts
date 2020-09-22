import { HubProduct, IGroupTemplate } from "../types";
import { cloneObject } from "@esri/hub-common";
import { WELLKNOWNTEAMS } from "../well-known-teams";

/**
 * Given a product, return the groups templates that are available
 * @param {string} product Product name portal | basic | premium
 */
export function getTeamsAvailableInProduct(product: HubProduct) {
  const filterFn = (tmpl: IGroupTemplate) => {
    return tmpl.config.availableIn.indexOf(product) > -1;
  };
  return cloneObject(WELLKNOWNTEAMS).filter(filterFn);
}
