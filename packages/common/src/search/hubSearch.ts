import HubError from "../HubError";
import { getProp } from "../objects";

import {
  IFilterGroup,
  FilterType,
  IHubSearchOptions,
  IHubSearchResponse,
  IHubSearchResult,
} from "./types";
import { expandApi } from "./utils";
import { hubSearchItems, portalSearchItems } from "./_internal";

/**
 * Main Search function for ArcGIS Hub
 *
 * Default's to search ArcGIS Portal but can delegate
 * to Hub API when it's available.
 * @param filterGroups
 * @param options
 * @returns
 */
export async function hubSearch(
  filterGroups: Array<IFilterGroup<FilterType>>,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  // Validate inputs
  if (!filterGroups || !Array.isArray(filterGroups)) {
    throw new HubError(
      "hubSearch",
      "FilterGroup is required and must be an array."
    );
  }
  if (!filterGroups.length) {
    throw new HubError(
      "hubSearch",
      "FilterGroup array must contain at least one entry."
    );
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
  const filterType = filterGroups[0].filterType as FilterType;
  // get the API
  const apiType = expandApi(options.api || "arcgis").type;

  const fnHash = {
    arcgis: {
      item: portalSearchItems,
    },
    "arcgis-hub": {
      item: hubSearchItems,
    },
  };

  const fn = getProp(fnHash, `${apiType}.${filterType}`);
  if (!fn) {
    throw new HubError(
      `hubSearch`,
      `Search via "${filterType}" filter against "${apiType}" api is not implemented`
    );
  }
  return fn(filterGroups, options);
}
