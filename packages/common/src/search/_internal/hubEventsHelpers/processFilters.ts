import { IFilter } from "../../types/IHubCatalog";
import {
  EventStatus,
  GetEventsParams,
} from "../../../events/api/orval/api/orval-events";
import { getOptionalPredicateStringsByKey } from "./getOptionalPredicateStringsByKey";
import { getPredicateValuesByKey } from "./getPredicateValuesByKey";
import { IDateRange } from "../../types/types";

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
  const canEdit = getPredicateValuesByKey<boolean>(filters, "canEdit");
  if (canEdit.length) {
    processedFilters.canEdit = canEdit[0].toString();
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
  const term = getPredicateValuesByKey<string>(filters, "term");
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
  const readGroupIds = getOptionalPredicateStringsByKey(
    filters,
    "readGroupsIds"
  );
  if (readGroupIds?.length) {
    processedFilters.readGroups = readGroupIds;
  }
  const editGroupsIds = getOptionalPredicateStringsByKey(
    filters,
    "editGroupsIds"
  );
  if (editGroupsIds?.length) {
    processedFilters.editGroups = editGroupsIds;
  }
  const attendanceType = getOptionalPredicateStringsByKey(
    filters,
    "attendanceType"
  );
  if (attendanceType?.length) {
    processedFilters.attendanceTypes = attendanceType;
  }
  const owner = getOptionalPredicateStringsByKey(filters, "owner");
  if (owner?.length) {
    // TODO: remove below @ts-ignore once https://devtopia.esri.com/dc/hub/issues/10691 is completed
    // @ts-ignore
    processedFilters.createdById = owner;
  }
  const status = getOptionalPredicateStringsByKey(filters, "status");
  processedFilters.status = status?.length
    ? status
    : [EventStatus.PLANNED, EventStatus.CANCELED]
        .map((val) => val.toLowerCase())
        .join(",");
  const startDateRange = getPredicateValuesByKey<IDateRange<string | number>>(
    filters,
    "startDateRange"
  );
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
