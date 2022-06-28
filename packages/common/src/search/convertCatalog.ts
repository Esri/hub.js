import { getProp } from "..";
import { IHubCatalog } from "./types";

/**
 * Convert the original site catalog structure into a formal ICatalog
 * @param original
 */
export function convertCatalog(original: any): IHubCatalog {
  const catalog: IHubCatalog = {
    schemaVersion: 1,
    title: "Default Catalog",
    scopes: {
      item: {
        targetEntity: "item",
        filters: [],
      },
    },
    collections: [],
  };

  const rawGroups = getProp(original, "groups");
  let groups = [];
  if (Array.isArray(rawGroups) && rawGroups.length) {
    groups = rawGroups;
  } else if (typeof rawGroups === "string") {
    groups = [rawGroups];
  }

  if (groups.length) {
    catalog.scopes.item.filters.push({
      predicates: [{ group: groups }],
    });
  }

  return catalog;
}
