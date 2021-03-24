import { HubProduct, IGroupTemplate } from "../types";
import { cloneObject } from "@esri/hub-common";
import { WELLKNOWNTEAMS } from "../well-known-teams";
import { OLDERWELLKNOWNTEAMS } from "../older-well-known-teams";

/**
 * Given a product, return the groups templates that are available
 * @param {string} product Product name portal | basic | premium
 */
export function getTeamsAvailableInProduct(
  product: HubProduct,
  currentVersion: string
) {
  // TODO: remove this when needed
  // choosing the type of well known team based on the current portal version
  const teams =
    parseFloat(currentVersion) < 9.1 ? OLDERWELLKNOWNTEAMS : WELLKNOWNTEAMS;
  const filterFn = (tmpl: IGroupTemplate) => {
    return tmpl.config.availableIn.indexOf(product) > -1;
  };
  return cloneObject(teams).filter(filterFn);
}
