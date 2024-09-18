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
  const eventIds = getOptionalPredicateStringsByKey(filters, "id");
  if (eventIds?.length) {
    processedFilters.eventIds = eventIds;
  }
  const term = getPredicateValuesByKey<string>(filters, "term");
  if (term.length) {
    processedFilters.title = term[0];
  }
  const orgId = getPredicateValuesByKey<string>(filters, "orgId");
  if (orgId.length) {
    processedFilters.orgId = orgId[0];
  }
  const categories = getOptionalPredicateStringsByKey(filters, "categories");
  if (categories?.length) {
    processedFilters.categories = categories;
  }
  const tags = getOptionalPredicateStringsByKey(filters, "tags");
  if (tags?.length) {
    processedFilters.tags = tags;
  }
  const groupIds = getPredicateValuesByKey<string>(filters, "group");
  // if a group was provided, we prioritize that over individual readGroupId or editGroupId
  // filters to prevent collisions
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
    // individual readGroupId & editGroupId filters
    const readGroupIds = getOptionalPredicateStringsByKey(
      filters,
      "readGroupId"
    );
    if (readGroupIds?.length) {
      processedFilters.readGroups = readGroupIds;
    }
    const editGroupIds = getOptionalPredicateStringsByKey(
      filters,
      "editGroupId"
    );
    if (editGroupIds?.length) {
      processedFilters.editGroups = editGroupIds;
    }
  }
  const notGroupIds = getPredicateValuesByKey<string>(filters, "notGroup");
  // if a notGroup was provided, we prioritize that over individual notReadGroupId or notEditGroupId
  // filters to prevent collisions
  if (notGroupIds.length) {
    const { results } = await searchGroups({
      q: `id:(${notGroupIds.join(" OR ")})`,
      num: notGroupIds.length,
      ...requestOptions,
    });
    const { notReadGroupIds, notEditGroupIds } = results.reduce(
      (acc, group) => {
        const key = isUpdateGroup(group)
          ? "notEditGroupIds"
          : "notReadGroupIds";
        return { ...acc, [key]: [...acc[key], group.id] };
      },
      { notReadGroupIds: [], notEditGroupIds: [] }
    );
    if (notReadGroupIds.length) {
      processedFilters.withoutReadGroups = notReadGroupIds.join(",");
    }
    if (notEditGroupIds.length) {
      processedFilters.withoutEditGroups = notEditGroupIds.join(",");
    }
  } else {
    // individual notReadGroupId & notEditGroupId filters
    const notReadGroupIds = getOptionalPredicateStringsByKey(
      filters,
      "notReadGroupId"
    );
    if (notReadGroupIds?.length) {
      processedFilters.withoutReadGroups = notReadGroupIds;
    }
    const notEditGroupIds = getOptionalPredicateStringsByKey(
      filters,
      "notEditGroupId"
    );
    if (notEditGroupIds?.length) {
      processedFilters.withoutEditGroups = notEditGroupIds;
    }
  }
  const attendanceType = getOptionalPredicateStringsByKey(
    filters,
    "attendanceType"
  );
  if (attendanceType?.length) {
    processedFilters.attendanceTypes = attendanceType;
  }
  const createdByIds = getOptionalPredicateStringsByKey(filters, "owner");
  if (createdByIds?.length) {
    processedFilters.createdByIds = createdByIds;
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
  // if a startDateRange was provided, we prioritize that over individual startDateBefore or startDateAfter
  // filters to prevent collisions
  if (startDateRange.length) {
    processedFilters.startDateTimeBefore = new Date(
      startDateRange[0].to
    ).toISOString();
    processedFilters.startDateTimeAfter = new Date(
      startDateRange[0].from
    ).toISOString();
  } else {
    // individual startDateBefore & startDateAfter filters
    const startDateBefore = getPredicateValuesByKey<string | number>(
      filters,
      "startDateBefore"
    );
    if (startDateBefore.length) {
      processedFilters.startDateTimeBefore = new Date(
        startDateBefore[0]
      ).toISOString();
    }
    const startDateAfter = getPredicateValuesByKey<string | number>(
      filters,
      "startDateAfter"
    );
    if (startDateAfter.length) {
      processedFilters.startDateTimeAfter = new Date(
        startDateAfter[0]
      ).toISOString();
    }
  }
  const endDateRange = getPredicateValuesByKey<IDateRange<string | number>>(
    filters,
    "endDateRange"
  );
  // if a endDateRange was provided, we prioritize that over individual endDateBefore or endDateAfter
  // filters to prevent collisions
  if (endDateRange.length) {
    processedFilters.endDateTimeBefore = new Date(
      endDateRange[0].to
    ).toISOString();
    processedFilters.endDateTimeAfter = new Date(
      endDateRange[0].from
    ).toISOString();
  } else {
    // individual endDateBefore & endDateAfter filters
    const endDateBefore = getPredicateValuesByKey<string | number>(
      filters,
      "endDateBefore"
    );
    if (endDateBefore.length) {
      processedFilters.endDateTimeBefore = new Date(
        endDateBefore[0]
      ).toISOString();
    }
    const endDateAfter = getPredicateValuesByKey<string | number>(
      filters,
      "endDateAfter"
    );
    if (endDateAfter.length) {
      processedFilters.endDateTimeAfter = new Date(
        endDateAfter[0]
      ).toISOString();
    }
  }
  return processedFilters;
}
