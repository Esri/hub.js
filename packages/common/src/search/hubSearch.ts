import { hubSearchGroups } from "./hubSearchGroups";
import { hubSearchItems } from "./hubSearchItems";
import {
  Filter,
  FilterType,
  IFilterBlock,
  IHubSearchOptions,
  IHubSearchResponse,
  IHubSearchResult,
} from "./types";
import { _searchContent } from "./_searchContent";

export function hubSearch(
  filters: IFilterBlock<FilterType>[],
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  let prms;
  // get the type of the first filter
  const f = filters[0];
  switch (f.filterType) {
    case "item":
      prms = hubSearchItems(filters as IFilterBlock<"item">[], options);
      break;
    case "group":
      prms = hubSearchGroups(filters as IFilterBlock<"group">[], options);
      break;
    default:
      // No-Op returning a fake HubSearchResponse
      throw new Error(`hubSearch for ${f.filterType} is not implemented`);
  }

  return prms;
}
