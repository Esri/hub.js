import { HubProduct } from "@esri/hub-types";
import { getTeamsAvailableInProduct } from "./get-teams-available-in-product";

/**
 * Get the types of teams that can be created given the product
 * @param {string} product Product name portal | basic | premium
 */
export function getTeamTypesAvailableInProduct(product: HubProduct) {
  return getTeamsAvailableInProduct(product).map(team => {
    return team.config.type;
  });
}
