import { hubSearchGroups } from "./hubSearchGroups";
import { hubSearchItems } from "./hubSearchItems";
import {
  Filter,
  FilterType,
  IHubSearchOptions,
  IHubSearchResponse,
  IHubSearchResult,
} from "./types";
import { _searchContent } from "./_searchContent";

export function hubSearch(
  filter: Filter<FilterType>,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  let prms;
  switch (filter.filterType) {
    case "item":
      prms = hubSearchItems(filter as Filter<"item">, options);
      break;
    case "group":
      prms = hubSearchGroups(filter as Filter<"group">, options);
      break;
    default:
      // No-Op returning a fake HubSearchResponse
      throw new Error(`hubSearch for ${filter.filterType} is not implemented`);
  }

  return prms;
}
