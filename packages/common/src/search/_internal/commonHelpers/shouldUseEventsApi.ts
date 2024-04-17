import { EntityType } from "../../types/IHubCatalog";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";

/**
 * @private
 * Determines if the Events API can be targeted with the given
 * search parameters
 * @param targetEntity
 * @param options
 * @returns boolean
 */
export function shouldUseEventsApi(
  targetEntity: EntityType,
  options: IHubSearchOptions
): boolean {
  const {
    requestOptions: { isPortal },
  } = options;
  return targetEntity === "event" && !isPortal;
}
