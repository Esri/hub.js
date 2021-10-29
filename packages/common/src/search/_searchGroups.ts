import { IGroup } from "@esri/arcgis-rest-portal";
import { Filter, IFacet, IHubSearchOptions } from "./types";
import { searchGroups as portalGroupSearch } from "@esri/arcgis-rest-portal";
import { expandApis } from ".";
export interface IGroupSearchResult {
  groups: IGroup[];
  facets: IFacet[];
}

export async function _searchGroups(
  filter: Filter<"group">,
  options: IHubSearchOptions
): Promise<IGroupSearchResult> {
  // expand filter so we can serialize to either api
  const expanded = expandGroupFilter(filter);

  // APIs
  if (!options.apis) {
    // default to AGO PROD
    options.apis = ["arcgis"];
  }
  const apis = expandApis(options.apis);

  return portalGroupSearch().then((response) => {});
}
