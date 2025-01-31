import { IQuery } from "../types/IHubCatalog";
import { IHubSearchOptions } from "../types/IHubSearchOptions";
import { IHubSearchResponse } from "../types/IHubSearchResponse";
import { IHubSearchResult } from "../types/IHubSearchResult";
import { searchEvents } from "../../events/api/events";
import {
  GetEventsInclude,
  GetEventsParams,
  ISearchEvents,
} from "../../events/api/orval/api/orval-events";
import { eventToSearchResult } from "./hubEventsHelpers/eventToSearchResult";
import { processOptions } from "./hubEventsHelpers/processOptions";
import { processFilters } from "./hubEventsHelpers/processFilters";

/**
 * Searches for events against the Events 3 API using the given `query` and `options`.
 * Currently supported filters include:
 *   - access: 'public' | 'private' | 'org' | Array<'public' | 'org' | 'private'>;
 *   - canEdit: boolean
 *   - entityId: string | string[];
 *   - entityType: string | string[];
 *   - id: string | string[];
 *   - term: string;
 *   - categories: string | string[];
 *   - tags: string | string[];
 *   - group: string | string[];
 *   - notGroup: string | string[];
 *   - readGroupId: string | string[];
 *   - notReadGroupId: string | string[];
 *   - editGroupId: string | string[];
 *   - notEditGroupId: string | string[];
 *   - attendanceType: 'virtual' | 'in_person' | Array<'virtual' | 'in_person'>;
 *   - owner: string | string[];
 *   - status: 'planned' | 'canceled' | 'removed' | Array<'planned' | 'canceled' | 'removed'>;
 *   - startDateBefore: string | number;
 *   - startDateAfter: string | number;
 *   - startDateRange: IDateRange<string | number>;
 *   - endDateRange: IDateRange<string | number>;
 *   - endDateBefore: string | number;
 *   - endDateAfter: string | number;
 *   - orgId: string;
 * Currently supported sort fields include:
 *   - created
 *   - modified
 *   - title
 *   - startDate
 * @param query An IQuery object
 * @param options An IHubSearchOptions object
 * @returns a promise that resolves a <IHubSearchResponse<IHubSearchResult> object
 */
export async function hubSearchEvents(
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  const processedFilters = await processFilters(
    query.filters,
    options.requestOptions
  );
  const processedOptions = processOptions(options);
  const data: ISearchEvents = {
    ...processedFilters,
    ...processedOptions,
    include: [GetEventsInclude.creator, GetEventsInclude.location],
  };
  const { items, nextStart, total } = await searchEvents({
    ...options.requestOptions,
    data,
  });
  const results = await Promise.all(
    items.map((event) => eventToSearchResult(event, options))
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
      return hubSearchEvents(query, {
        ...options,
        start: nextStart,
      });
    },
  };
}
