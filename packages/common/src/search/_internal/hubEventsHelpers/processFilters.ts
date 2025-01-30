import { IFilter } from "../../types/IHubCatalog";
import {
  EventAccess,
  EventAssociationEntityType,
  EventAttendanceType,
  EventStatus,
  ISearchEvents,
} from "../../../events/api/orval/api/orval-events";
import { getPredicateValuesByKey } from "./getPredicateValuesByKey";
import { getUniquePredicateValuesByKey } from "./getUniquePredicateValuesByKey";
import { IDateRange } from "../../types/types";
import { searchGroups } from "@esri/arcgis-rest-portal";
import { IHubRequestOptions } from "../../../types";
import { isUpdateGroup } from "../../../utils/is-update-group";
import { toEnums } from "./toEnumConverters";

/**
 * Builds a Partial<ISearchEvents> given an Array of IFilter objects
 * @param filters An Array of IFilter
 * @returns a Partial<ISearchEvents> for the given Array of IFilter objects
 */
export async function processFilters(
  filters: IFilter[],
  requestOptions: IHubRequestOptions
): Promise<Partial<ISearchEvents>> {
  const processedFilters: Partial<ISearchEvents> = {};
  const access = getUniquePredicateValuesByKey<string>(filters, "access");
  if (access.length) {
    processedFilters.access = toEnums(access, EventAccess);
  }
  const canEdit = getPredicateValuesByKey<boolean>(filters, "canEdit");
  if (canEdit.length) {
    processedFilters.canEdit = canEdit[0];
  }
  const entityIds = getUniquePredicateValuesByKey<string>(filters, "entityId");
  if (entityIds?.length) {
    processedFilters.entityIds = entityIds;
  }
  const entityTypes = getUniquePredicateValuesByKey<string>(
    filters,
    "entityType"
  );
  if (entityTypes?.length) {
    processedFilters.entityTypes = toEnums(
      entityTypes,
      EventAssociationEntityType
    );
  }
  const eventIds = getUniquePredicateValuesByKey<string>(filters, "id");
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
  const categories = getUniquePredicateValuesByKey<string>(
    filters,
    "categories"
  );
  if (categories?.length) {
    processedFilters.categories = categories;
  }
  const tags = getUniquePredicateValuesByKey<string>(filters, "tags");
  if (tags?.length) {
    processedFilters.tags = tags;
  }
  const groupIds = getUniquePredicateValuesByKey<string>(filters, "group");
  // if a group was provided, we prioritize that over individual readGroupId or editGroupId
  // filters to prevent collisions
  if (groupIds?.length) {
    // We are explicitly sending groupIds to sharedToGroups
    processedFilters.sharedToGroups = groupIds;
  } else {
    // individual readGroupId & editGroupId filters
    const readGroupIds = getUniquePredicateValuesByKey<string>(
      filters,
      "readGroupId"
    );
    if (readGroupIds?.length) {
      processedFilters.readGroups = readGroupIds;
    }
    const editGroupIds = getUniquePredicateValuesByKey<string>(
      filters,
      "editGroupId"
    );
    if (editGroupIds?.length) {
      processedFilters.editGroups = editGroupIds;
    }
  }
  // NOTE: previously notGroup was an inverse of group, but now they are subtly different
  // We do not yet have an inverse of sharedToGroups.
  const notGroupIds = getUniquePredicateValuesByKey<string>(
    filters,
    "notGroup"
  );
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
      processedFilters.withoutReadGroups = notReadGroupIds;
    }
    if (notEditGroupIds.length) {
      processedFilters.withoutEditGroups = notEditGroupIds;
    }
  } else {
    // individual notReadGroupId & notEditGroupId filters
    const notReadGroupIds = getUniquePredicateValuesByKey<string>(
      filters,
      "notReadGroupId"
    );
    if (notReadGroupIds?.length) {
      processedFilters.withoutReadGroups = notReadGroupIds;
    }
    const notEditGroupIds = getUniquePredicateValuesByKey<string>(
      filters,
      "notEditGroupId"
    );
    if (notEditGroupIds?.length) {
      processedFilters.withoutEditGroups = notEditGroupIds;
    }
  }
  // todo: <enums or strings?> (API is upper casing each value in the array, but throws off the typing here)
  const attendanceType = getUniquePredicateValuesByKey<string>(
    filters,
    "attendanceType"
  );
  if (attendanceType?.length) {
    processedFilters.attendanceTypes = toEnums(
      attendanceType,
      EventAttendanceType
    );
  }
  const createdByIds = getUniquePredicateValuesByKey<string>(filters, "owner");
  if (createdByIds?.length) {
    processedFilters.createdByIds = createdByIds;
  }
  // todo: <enums or strings?> (API is upper casing each value in the array, but throws off the typing here)
  const status = getUniquePredicateValuesByKey<string>(filters, "status");
  processedFilters.status = status?.length
    ? toEnums(status, EventStatus)
    : [EventStatus.PLANNED, EventStatus.CANCELED];

  const startDateRange = getPredicateValuesByKey<IDateRange<string | number>>(
    filters,
    "startDateRange"
  );
  // if a startDateRange was provided, we prioritize that over individual startDateBefore or startDateAfter
  // filters to prevent collisions
  // We are explicitly checking if the to and from values are present
  // Because w/ Occurrence, we can have just to or from values
  if (startDateRange.length) {
    startDateRange[0].to &&
      (processedFilters.startDateTimeBefore = new Date(
        startDateRange[0].to
      ).toISOString());
    startDateRange[0].from &&
      (processedFilters.startDateTimeAfter = new Date(
        startDateRange[0].from
      ).toISOString());
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
  // We are explicitly checking if the to and from values are present
  // Because w/ Occurrence, we can have just to or from values
  if (endDateRange.length) {
    endDateRange[0].to &&
      (processedFilters.endDateTimeBefore = new Date(
        endDateRange[0].to
      ).toISOString());
    endDateRange[0].from &&
      (processedFilters.endDateTimeAfter = new Date(
        endDateRange[0].from
      ).toISOString());
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

  // If there's an occurrence filter, we need to adjust the startDateTimeBefore, startDateTimeAfter
  // Depending on the occurrence.
  const occurrence = getPredicateValuesByKey<string>(filters, "occurrence");
  if (occurrence.length) {
    occurrence.forEach((o) => {
      switch (o) {
        case "upcoming":
          processedFilters.startDateTimeAfter = new Date().toISOString();
          break;
        case "past":
          processedFilters.endDateTimeBefore = new Date().toISOString();
          break;
        case "inProgress":
          processedFilters.startDateTimeBefore = new Date().toISOString();
          processedFilters.endDateTimeAfter = new Date().toISOString();
          break;
      }
    });
  }
  return processedFilters;
}
