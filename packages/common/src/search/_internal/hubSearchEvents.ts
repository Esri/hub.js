import { IQuery } from "../types/IHubCatalog";
import { IHubSearchOptions } from "../types/IHubSearchOptions";
import { IHubSearchResponse } from "../types/IHubSearchResponse";
import { IHubSearchResult } from "../types/IHubSearchResult";
import { getEvents } from "../../events/api/events";
import { GetEventsParams } from "../../events/api/orval/api/orval-events";
import { eventToSearchResult } from "./hubEventsHelpers/eventToSearchResult";
import { processOptions } from "./hubEventsHelpers/processOptions";
import { processFilters } from "./hubEventsHelpers/processFilters";

export async function hubSearchEvents(
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  const processedFilters = processFilters(query.filters);
  const processedOptions = processOptions(options);
  const data: GetEventsParams = {
    ...processedFilters,
    ...processedOptions,
    include: "creator,registrations",
  };
  const { items, nextStart, total } = await getEvents({
    ...options.requestOptions,
    data,
  });
  const results = items.map((event) => eventToSearchResult(event, options));
  const hasNext = nextStart > -1;
  return {
    total,
    results,
    hasNext,
    next: () => {
      if (!hasNext) {
        throw new Error("No more hub events for the given query and options");
      }
      return hubSearchEvents(query, {
        ...options,
        start: nextStart,
      });
    },
  };
}
