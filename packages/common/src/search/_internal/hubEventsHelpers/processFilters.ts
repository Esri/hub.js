import { IFilter } from "../../types/IHubCatalog";
import {
  EventStatus,
  GetEventsParams,
} from "../../../events/api/orval/api/orval-events";
import { getOptionalPredicateStringsByKey } from "./getOptionalPredicateStringsByKey";
import { getPredicateValuesByKey } from "./getPredicateValuesByKey";
import { IDateRange } from "../../types/types";
import { searchGroups } from "@esri/arcgis-rest-portal";
import { IHubRequestOptions } from "../../../types";
import { isUpdateGroup } from "../../../utils/is-update-group";

/**
 * Builds a Partial<GetEventsParams> given an Array of IFilter objects
 * @param filters An Array of IFilter
 * @returns a Partial<GetEventsParams> for the given Array of IFilter objects
 */
export async function processFilters(
  filters: IFilter[],
  requestOptions: IHubRequestOptions
): Promise<Partial<GetEventsParams>> {
  const processedFilters: Partial<GetEventsParams> = {};
  const access = getOptionalPredicateStringsByKey(filters, "access");
  if (access?.length) {
    processedFilters.access = access;
  }
  const canEdit = getPredicateValuesByKey<boolean>(filters, "canEdit");
  if (canEdit.length) {
    processedFilters.canEdit = canEdit[0].toString();
  }
  const entityIds = getOptionalPredicateStringsByKey(filters, "entityId");
  if (entityIds?.length) {
    processedFilters.entityIds = entityIds;
  }
  const entityTypes = getOptionalPredicateStringsByKey(filters, "entityType");
  if (entityTypes?.length) {
    processedFilters.entityTypes = entityTypes;
  }
  const eventIds = getOptionalPredicateStringsByKey(filters, "eventId");
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
  const groupIds = getPredicateValuesByKey<string>(filters, "groups");
  if (groupIds.length) {
    const { results } = await searchGroups({
      q: `id:(${groupIds.join(" OR ")})`,
      num: groupIds.length,
      ...requestOptions,
    });
    const { readGroupIds, editGroupIds } = results.reduce(
      (acc, group) => {
        const key = isUpdateGroup(group) ? "editGroupIds" : "readGroupIds";
        return { ...acc, [key]: [...acc[key], group.id] };
      },
      { readGroupIds: [], editGroupIds: [] }
    );
    if (readGroupIds.length) {
      processedFilters.readGroups = readGroupIds.join(",");
    }
    if (editGroupIds.length) {
      processedFilters.editGroups = editGroupIds.join(",");
    }
  } else {
    const readGroupIds = getOptionalPredicateStringsByKey(
      filters,
      "readGroupId"
    );
    if (readGroupIds?.length) {
      processedFilters.readGroups = readGroupIds;
    }
    const editGroupsIds = getOptionalPredicateStringsByKey(
      filters,
      "editGroupId"
    );
    if (editGroupsIds?.length) {
      processedFilters.editGroups = editGroupsIds;
    }
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
    processedFilters.createdByIds = owner;
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
