import { HubProduct, IGroupTemplate } from "../types";
import { cloneObject } from "@esri/hub-common";
import { WELLKNOWNTEAMS } from "../well-known-teams";

// TODO: at next breaking change remove portalApiVersion param
/**
 * Given a product, return the groups templates that are available
 * @param {string} product Product name portal | basic | premium
 */
export function getTeamsAvailableInProduct(
  product: HubProduct,
  portalApiVersion: string // DEPRECATED
) {
  /* tslint:disable no-console */
  console.warn(
    "Hub.js::getTeamsAvailableInProduct Deprecation warning portalApiVersion will be removed at v10.0.0"
  );
  /* tslint:enable no-console */
  const teams = WELLKNOWNTEAMS;
  const filterFn = (tmpl: IGroupTemplate) => {
    return tmpl.config.availableIn.indexOf(product) > -1;
  };
  return cloneObject(teams).filter(filterFn);
}
