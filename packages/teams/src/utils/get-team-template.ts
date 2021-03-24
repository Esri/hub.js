import { HubTeamType, HubProduct } from "../types";
import { getTeamsAvailableInProduct } from "./get-teams-available-in-product";

/**
 * Get the template for a team. This should be used sparingly,
 * usually when you need some of the default properties of the
 * group, but in a context outside of the normal team-service functions.
 * @param {string} team core \ content | followers | team
 * @param {string} product basic | premium | portal
 * @param {string} portalApiVersion portal version
 */
export function getTeamTemplate(
  type: HubTeamType,
  product: HubProduct,
  portalApiVersion: string
) {
  return getTeamsAvailableInProduct(product, portalApiVersion).find(t => {
    return t.config.type === type;
  });
}
