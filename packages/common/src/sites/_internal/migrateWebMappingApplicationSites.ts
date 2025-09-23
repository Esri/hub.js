import { IDraft, IModel } from "../../hub-types";
import { getProp } from "../../objects/get-prop";
import { getWithDefault } from "../../objects/get-with-default";

/**
 * Early Hub sites were persisted as items of type "Web Mapping
 * Application" with a typeKeyword of "hubSite". We want these
 * items to act like regular "Hub Site Application"s, so we add
 * this versionless migration to artificially update the type
 * of old site items.
 *
 * Note: this change won't be persisted on the item itself,
 * which is why this migration must always run.
 *
 * @param model Site Model
 * @private
 */
export function migrateWebMappingApplicationSites<T extends IModel | IDraft>(
  model: T
): T {
  const isWebMappingApplication =
    getProp(model, "item.type") === "Web Mapping Application";
  const hasHubSiteKeyword = getWithDefault(
    model,
    "item.typeKeywords",
    []
  ).includes("hubSite");

  if (isWebMappingApplication && hasHubSiteKeyword) {
    model.item.type = "Hub Site Application";
  }

  return model;
}
