import { IFilter } from "../../types/IHubCatalog";
import {
  EventStatus,
  GetEventsParams,
} from "../../../events/api/orval/api/orval-events";
import { getOptionalPredicateStringsByKey } from "./getOptionalPredicateStringsByKey";
import { getPredicateValuesByKey } from "./getPredicateValuesByKey";

/**
 * Builds a Partial<GetEventsParams> given an Array of IFilter objects
 * @param filters An Array of IFilter
 * @returns a Partial<GetEventsParams> for the given Array of IFilter objects
 */
export function processFilters(filters: IFilter[]): Partial<GetEventsParams> {
  const processedFilters: Partial<GetEventsParams> = {};
  const access = getOptionalPredicateStringsByKey(filters, "access");
  if (access?.length) {
    // TODO: remove ts-ignore once GetEventsParams supports filtering by access
    // @ts-ignore
    processedFilters.access = access;
  }
  const term = getPredicateValuesByKey(filters, "term");
  if (term.length) {
    processedFilters.title = term[0];
  }
  const categories = getOptionalPredicateStringsByKey(filters, "categories");
  if (categories?.length) {
    processedFilters.categories = categories;
  }
  const tags = getOptionalPredicateStringsByKey(filters, "tags");
  if (tags?.length) {
    processedFilters.tags = tags;
  }
  const attendanceType = getOptionalPredicateStringsByKey(
    filters,
    "attendanceType"
  );
  if (attendanceType?.length) {
    processedFilters.attendanceTypes = attendanceType;
  }
  const status = getOptionalPredicateStringsByKey(filters, "status");
  processedFilters.status = status?.length
    ? status
    : [EventStatus.PLANNED, EventStatus.CANCELED]
        .map((val) => val.toLowerCase())
        .join(",");
  const startDateRange = getPredicateValuesByKey(filters, "startDateRange");
  if (startDateRange.length) {
    processedFilters.startDateTimeBefore = new Date(
      startDateRange[0].to
    ).toISOString();
    processedFilters.startDateTimeAfter = new Date(
      startDateRange[0].from
    ).toISOString();
  }
  return processedFilters;
}
