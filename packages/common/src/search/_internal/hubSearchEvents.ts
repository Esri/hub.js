import { IFilter, IPredicate, IQuery } from "../types/IHubCatalog";
import { IHubSearchOptions } from "../types/IHubSearchOptions";
import { IHubSearchResponse } from "../types/IHubSearchResponse";
import { IHubSearchResult } from "../types/IHubSearchResult";
import { getEvents } from "../../events/api/events";
import {
  EventSort,
  GetEventsParams,
  IEvent,
  SortOrder,
} from "../../events/api/orval/api/orval-events";
import { AccessLevel } from "../../core/types/types";
import { HubFamily } from "../../types";

export function eventToSearchResult(event: IEvent): IHubSearchResult {
  const result = {
    access: event.access.toLocaleLowerCase() as AccessLevel,
    id: event.id,
    type: "Event",
    name: event.title,
    owner: event.creator.username,
    summary: event.summary,
    createdDate: new Date(event.createdAt),
    createdDateSource: "event.createdAt",
    updatedDate: new Date(event.updatedAt),
    updatedDateSource: "event.updatedAt",
    family: "event" as HubFamily,
    links: {
      self: "not-implemented",
      siteRelative: "not-implemented",
      thumbnail: "not-implemented",
      workspaceRelative: "not-implemented",
    },
    tags: event.tags,
    categories: event.categories,
    rawResult: event,
  };
  // TODO: location
  // TODO: links
  // TODO: enrichments?
  return result;
}

export function processFilters(filters: IFilter[]): Partial<GetEventsParams> {
  // since we're directly querying Events API which doesn't support advanced
  // filtering like contains, and, or, etc, simply merge all filter predicates
  // into a single predicate
  const predicate = filters.reduce<IPredicate>(
    (acc, filter) =>
      filter.predicates.reduce<IPredicate>(
        (memo, pred) => ({ ...memo, ...pred }),
        acc
      ),
    {}
  );
  // build the processed filters
  const processedFilters: Partial<GetEventsParams> = {};
  if (predicate.categories) {
    processedFilters.categories = predicate.categories.join(", ");
  }
  if (predicate.tags) {
    processedFilters.tags = predicate.tags.join(", ");
  }
  return processedFilters;
}

export function processOptions(
  options: IHubSearchOptions
): Partial<GetEventsParams> {
  const processedOptions: Partial<GetEventsParams> = {};
  if (options?.num > 0) {
    // should this maybe be a number?
    processedOptions.num = options.num.toString();
  }
  if (options?.start > 1) {
    // should this maybe be a number?
    processedOptions.start = options.start.toString();
  }
  if (EventSort[options.sortField as EventSort]) {
    processedOptions.sortBy = options.sortField as EventSort;
  }
  if (SortOrder[options.sortOrder as SortOrder]) {
    processedOptions.sortOrder = options.sortOrder as SortOrder;
  }
  // TODO: startDateTimeBefore
  // TODO: startDateTimeAfter
  // TODO: attendanceTypes
  // TODO: status
  // TODO: title
  return processedOptions;
}

export async function hubSearchEvents(
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  const processedFilters = processFilters(query.filters);
  const processedOptions = processOptions(options);
  const data: GetEventsParams = {
    ...processedFilters,
    ...processedOptions,
  };
  const { items, nextStart, total } = await getEvents({
    ...options.requestOptions,
    data,
  });
  return {
    total,
    results: items.map(eventToSearchResult),
    hasNext: nextStart > -1,
    next: () =>
      hubSearchEvents(query, {
        ...options,
        start: nextStart,
      }),
  };
}
