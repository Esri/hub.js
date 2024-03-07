import { EntityType } from "../../types/IHubCatalog";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";

/**
 * @private
 * Determines whether the OGC API can be targeted with the given search parameters
 * @param targetEntity target entity of the query
 * @param options search options
 */
export function shouldUseOgcApi(
  targetEntity: EntityType,
  options: IHubSearchOptions
): boolean {
  const {
    site,
    requestOptions: { isPortal },
  } = options;
  if (isPortal) return false;
  if (targetEntity === "discussionPost") return true;
  return targetEntity === "item" && !!site;
}
