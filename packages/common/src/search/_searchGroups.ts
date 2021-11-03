import { IGroup } from "@esri/arcgis-rest-portal";
import { Filter, IFacet, IHubSearchOptions } from "./types";
import { searchGroups as portalGroupSearch } from "@esri/arcgis-rest-portal";
import { convertPortalResponseToFacets, expandApis } from ".";
import {
  expandGroupFilter,
  serializeGroupFilterForPortal,
} from "./group-utils";
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
  const so = serializeGroupFilterForPortal(expanded);
  // pass auth forward
  if (options.authentication) {
    so.authentication = options.authentication;
  }
  // Aggregations
  if (options.aggregations?.length) {
    so.countFields = options.aggregations.join(",");
    so.countSize = 200;
  }
  if (options.num) {
    so.num = options.num;
  }
  return portalGroupSearch(so).then((response) => {
    // TODO: upgrade thumbnail url
    const groups = response.results;
    // Group Search does not support any aggregations
    const facets = [] as IFacet[];
    return { groups, facets };
  });
}
