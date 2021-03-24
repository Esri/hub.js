import { HubProduct } from "../types";
import { getTeamsAvailableInProduct } from "./get-teams-available-in-product";

/**
 * Get the types of teams that can be created given the product
 * @param {string} product Product name portal | basic | premium
 */
export function getTeamTypesAvailableInProduct(
  product: HubProduct,
  portalApiVersion: string
) {
  return getTeamsAvailableInProduct(product, portalApiVersion).map(team => {
    return team.config.type;
  });
}
