import { getProp } from "../objects/get-prop";

export type HubProduct = "premium" | "portal" | "basic";

/**
 * Gien a portal settings object, determine the hub product name
 * @param {Object} portal Portal settings object
 */
export function getHubProduct(portal: { [index: string]: any }): HubProduct {
  const isPremium = getProp(portal, "portalProperties.hub.enabled") || false;
  let product: HubProduct = isPremium ? "premium" : "basic";
  // TODO confirm w/ AGO that this is 100% bomber logic
  if (portal.isPortal && portal.portalMode === "singletenant") {
    product = "portal";
  }
  return product;
}
