import { EntityType } from "../../types/IHubCatalog";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";

/**
 * @private
 * Determines if the Discussions API can be targeted with the given
 * search parameters
 * @param targetEntity
 * @param options
 * @returns boolean
 */
export function shouldUseDiscussionsApi(
  targetEntity: EntityType,
  options: IHubSearchOptions
): boolean {
  const {
    requestOptions: { isPortal },
  } = options;
  return targetEntity === "channel" && !isPortal;
}
