import { IFilter, IPredicate, IQuery } from "../types/IHubCatalog";
import { IHubSearchOptions } from "../types/IHubSearchOptions";
import { IHubSearchResponse } from "../types/IHubSearchResponse";
import { IHubSearchResult } from "../types/IHubSearchResult";
import { getEvents } from "../../events/api/events";
import {
  EventAttendanceType,
  EventSort,
  GetEventsParams,
  IEvent,
  IPagedRegistrationResponse,
  RegistrationStatus,
  SortOrder,
} from "../../events/api/orval/api/orval-events";
import { AccessLevel } from "../../core/types/types";
import { HubFamily } from "../../types";
import { getRegistrations } from "../../events/api/registrations";
import { computeLinks } from "../../events/_internal/computeLinks";

export async function eventToSearchResult(
  event: IEvent,
  options: IHubSearchOptions
): Promise<IHubSearchResult> {
  const { total, items: attendees } = event.allowRegistration
    ? await getRegistrations({
        data: {
          eventId: event.id,
          status: RegistrationStatus.ACCEPTED,
          num: "1",
        },
        ...options.requestOptions,
      })
    : ({ total: 0, items: [] } as IPagedRegistrationResponse);
  const result = {
    access: event.access.toLowerCase() as AccessLevel,
    id: event.id,
    type: "Event",
    name: event.title,
    owner: event.creator.username,
    ownerUser: event.creator,
    summary: event.summary,
    createdDate: new Date(event.createdAt),
    createdDateSource: "event.createdAt",
    updatedDate: new Date(event.updatedAt),
    updatedDateSource: "event.updatedAt",
    family: "event" as HubFamily,
    links: computeLinks(event),
    tags: event.tags,
    categories: event.categories,
    rawResult: event,
    status: event.status,
    startDateTime: new Date(event.startDateTime),
    endDateTime: new Date(event.endDateTime),
    numAttendeesTotal: total,
    attendanceType: event.attendanceType.map((attendanceType) =>
      attendanceType.toLowerCase()
    ),
    onlineUrl: event.onlineMeetings?.[0].url,
    onlineCapacity: event.onlineMeetings?.[0].capacity,
    onlineAttendance: attendees.filter(
      (attendee) => attendee.type === EventAttendanceType.VIRTUAL
    ).length,
    inPersonAddress: event.addresses?.[0].address,
    inPersonCapacity: event.addresses?.[0].capacity,
    inPersonAttendance: attendees.filter(
      (attendee) => attendee.type === EventAttendanceType.IN_PERSON
    ).length,
  };
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
  if (predicate.categories?.length) {
    processedFilters.categories = predicate.categories.join(",");
  }
  if (predicate.tags?.length) {
    processedFilters.tags = predicate.tags.join(",");
  }
  if (predicate.attendanceTypes?.length) {
    processedFilters.attendanceTypes = predicate.attendanceTypes.join(",");
  }
  if (predicate.status?.length) {
    processedFilters.status = predicate.status.join(",");
  }
  if (predicate.title?.length) {
    processedFilters.title = predicate.title;
  }
  if (predicate.startDateRange) {
    const to = new Date(predicate.startDateRange.to);
    processedFilters.startDateTimeBefore = new Date(
      to.getFullYear(),
      to.getMonth(),
      to.getDate(),
      23,
      59,
      59,
      999
    ).toISOString();
    const from = new Date(predicate.startDateRange.from);
    processedFilters.startDateTimeAfter = new Date(
      from.getFullYear(),
      from.getMonth(),
      from.getDate(),
      0,
      0,
      0,
      0
    ).toISOString();
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
    include: "creator",
  };
  const { items, nextStart, total } = await getEvents({
    ...options.requestOptions,
    data,
  });
  const results = await Promise.all(
    items.map((event) => eventToSearchResult(event, options))
  );
  return {
    total,
    results,
    hasNext: nextStart > -1,
    next: () =>
      hubSearchEvents(query, {
        ...options,
        start: nextStart,
      }),
  };
}
