import { getRegistrations } from "../../events/api/registrations";
import { eventAttendeeToSearchResult } from "./hubEventsHelpers/eventAttendeeToSearchResult";
import { IQuery } from "../types/IHubCatalog";
import { IHubSearchOptions } from "../types/IHubSearchOptions";
import { IHubSearchResponse } from "../types/IHubSearchResponse";
import { IHubSearchResult } from "../types/IHubSearchResult";
import { GetRegistrationsParams } from "../../events/api/types";
import { processAttendeeOptions } from "./hubEventsHelpers/processAttendeeOptions";
import { processAttendeeFilters } from "./hubEventsHelpers/processAttendeeFilters";

/**
 * @private
 * Execute event attendees search against the Events API
 * @param query
 * @param options
 * @returns
 */
export async function hubSearchEventAttendees(
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  const processedFilters = processAttendeeFilters(query);
  const processedOptions = processAttendeeOptions(options);
  const data: GetRegistrationsParams = {
    ...processedFilters,
    ...processedOptions,
  };
  const { items, nextStart, total } = await getRegistrations({
    ...options.requestOptions,
    data,
  });
  const results = await Promise.all(
    items.map((eventAttendee) =>
      eventAttendeeToSearchResult(eventAttendee, options)
    )
  );
  const hasNext = nextStart > -1;
  return {
    total,
    results,
    hasNext,
    next: () => {
      if (!hasNext) {
        throw new Error("No more hub events for the given query and options");
      }
      return hubSearchEventAttendees(query, {
        ...options,
        start: nextStart,
      });
    },
  };
}
