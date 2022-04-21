import { getProp } from "..";
import { Filter, ICatalog } from "./types";

/**
 * Convert the original site catalog structure into a formal ICatalog
 * @param original
 */
export function convertCatalog(original: any): ICatalog {
  const filter: Filter<"content"> = {
    filterType: "content",
  };

  const groups = getProp(original, "groups");

  if (Array.isArray(groups) && groups.length) {
    filter.group = groups;
  } else if (typeof groups === "string") {
    filter.group = [groups];
  }

  const catalog: ICatalog = {
    title: "Default Catalog",
    filter,
  };

  return catalog;
}
