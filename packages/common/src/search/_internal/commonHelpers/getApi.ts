import { EntityType } from "../../types/IHubCatalog";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";
import { IApiDefinition } from "../../types/types";
import { expandApi } from "../../utils";
import { shouldUseOgcApi } from "./shouldUseOgcApi";

/**
 * @private
 * Determines Which API should be hit for the given search parameters.
 * Hierarchy:
 * - Target options.api if available
 * - Target the OGC API current parameters allow
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
    api,
    site,
    requestOptions: { portal },
  } = options;

  let result: IApiDefinition;
  if (api) {
    result = expandApi(api);
  } else if (shouldUseOgcApi(targetEntity, options)) {
    result = {
      type: "arcgis-hub",
      url: `${site}/api/search/v1`,
    };
  } else {
    result = { type: "arcgis", url: portal };
  }

  return result;
}
