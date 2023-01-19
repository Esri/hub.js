import HubError from "../HubError";
import { getProp } from "../objects";
import { cloneObject } from "../util";
import {
  IHubSearchOptions,
  IHubSearchResponse,
  IHubSearchResult,
  IQuery,
} from "./types";
import { expandApi } from "./utils";
import {
  hubSearchItems,
  portalSearchItems,
  portalSearchGroups,
  portalSearchUsers,
} from "./_internal";

/**
 * Main entrypoint for searching via Hub
 *
 * Default's to search ArcGIS Portal but can delegate
 * to Hub API when it's available.
 * @param query
 * @param options
 * @returns
 */
export async function hubSearch(
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  // Validate inputs
  if (!query) {
    throw new HubError("hubSearch", "Query is required.");
  }
  if (!query.filters || !query.filters.length) {
    throw new HubError("hubSearch", "Query must contain at least one Filter.");
  }

  if (!options.requestOptions) {
    throw new HubError(
      "hubSearch",
      "requestOptions: IHubRequestOptions is required."
    );
  }

  // Ensure includes is an array
  if (!options.include) {
    options.include = [];
  }

  // Get the type of the first filterGroup
  const filterType = query.targetEntity;
  // get the API
  const apiType = expandApi(options.api || "arcgis").type;

  const fnHash = {
    arcgis: {
      item: portalSearchItems,
      group: portalSearchGroups,
      user: portalSearchUsers,
    },
    "arcgis-hub": {
      item: hubSearchItems,
    },
  };

  const fn = getProp(fnHash, `${apiType}.${filterType}`);
  if (!fn) {
    throw new HubError(
      `hubSearch`,
      `Search via "${filterType}" filter against "${apiType}" api is not implemented. Please ensure "targetEntity" is defined on the query.`
    );
  }
  return fn(cloneObject(query), options);
}
