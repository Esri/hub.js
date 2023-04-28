import { EntityType } from "../../types/IHubCatalog";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";
import { IApiDefinition } from "../../types/types";
import { shouldUseOgcApi } from "./shouldUseOgcApi";

/**
 * @private
 * Determines Which API should be hit for the given search parameters.
 * Hierarchy:
 * - Target the OGC API if current parameters allow
 * - Target the Portal API based off options.requestOptions.portal
 * @param targetEntity target entity of the query
 * @param options search options
 * @returns an API Definition object describing what should be targeted
 */
export function getApi(
  targetEntity: EntityType,
  options: IHubSearchOptions
): IApiDefinition {
  const {
    site,
    requestOptions: { portal },
  } = options;

  let result: IApiDefinition = { type: "arcgis", url: portal };
  if (shouldUseOgcApi(targetEntity, options)) {
    result = {
      type: "arcgis-hub",
      url: `${site}/api/search/v1`,
    };
  }

  return result;
}
