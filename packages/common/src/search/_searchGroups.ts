import { IGroup } from "@esri/arcgis-rest-portal";
import { Filter, IFacet, IHubSearchOptions } from "./types";
import { searchGroups } from "@esri/arcgis-rest-portal";
export interface IGroupSearchResult {
  groups: IGroup[];
  facets: IFacet[];
}

export async function _searchGroups(
  filter: Filter<"group">,
  options: IHubSearchOptions
): Promise<IGroupSearchResult> {
  throw new Error("not implemented");
}
