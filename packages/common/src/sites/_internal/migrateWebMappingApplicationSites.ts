import { getProp, getWithDefault } from "../../objects";
import { IDraft, IModel } from "../../types";

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
