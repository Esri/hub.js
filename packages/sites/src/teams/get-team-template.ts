import { HubTeamType, HubProduct } from "./types";
import { getTeamsAvailableInProduct } from "./get-teams-available-in-product";

/**
 * Get the template for a team. This should be used sparingly,
 * usually when you need some of the default properties of the
 * group, but in a context outside of the normal team-service functions.
 * @param {string} team core \ content | followers | team
 * @param {string} product basic | premium | portal
 */
export function getTeamTemplate(type: HubTeamType, product: HubProduct) {
  return getTeamsAvailableInProduct(product).find(t => {
    return t.config.type === type;
  });
}
