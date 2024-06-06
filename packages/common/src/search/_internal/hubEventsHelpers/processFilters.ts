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
    processedFilters.access = access;
  }
  const canEdit = getOptionalPredicateStringsByKey(filters, "canEdit");
  if (canEdit?.length) {
    processedFilters.canEdit = canEdit;
  }
  const entityIds = getOptionalPredicateStringsByKey(filters, "entityIds");
  if (entityIds?.length) {
    processedFilters.entityIds = entityIds;
  }
  const entityTypes = getOptionalPredicateStringsByKey(filters, "entityTypes");
  if (entityTypes?.length) {
    processedFilters.entityTypes = entityTypes;
  }
  const eventIds = getOptionalPredicateStringsByKey(filters, "eventIds");
  if (eventIds?.length) {
    processedFilters.eventIds = eventIds;
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
  const readGroups = getOptionalPredicateStringsByKey(filters, "readGroups");
  if (readGroups?.length) {
    processedFilters.readGroups = readGroups;
  }
  const editGroups = getOptionalPredicateStringsByKey(filters, "editGroups");
  if (editGroups?.length) {
    processedFilters.editGroups = editGroups;
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
