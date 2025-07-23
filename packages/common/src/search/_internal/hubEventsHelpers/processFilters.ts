import { IFilter } from "../../types/IHubCatalog";
import {
  EventAccess,
  EventAssociationEntityType,
  EventAttendanceType,
  EventStatus,
  ISearchEvents,
} from "../../../events/api/orval/api/orval-events";
import { toEnums } from "./toEnumConverters";
import {
  flattenFilters,
  parseIdsAndNotIds,
} from "../hubDiscussionsHelpers/processChannelFilters";
import { unique } from "../../../util";
import { IDateRange } from "../../types/types";

/**
 * Builds a Partial<ISearchEvents> given an Array of IFilter objects
 * @param filters An Array of IFilter
 * @returns a Partial<ISearchEvents> for the given Array of IFilter objects
 */
export function processFilters(filters: IFilter[]): Partial<ISearchEvents> {
  const flattenedFilters = flattenFilters(filters);
  const processedFilters: Partial<ISearchEvents> = {};

  // access
  if (flattenedFilters.access?.length) {
    processedFilters.access = toEnums(
      flattenedFilters.access as string[],
      EventAccess
    );
  }

  // canEdit
  if (flattenedFilters.canEdit?.length) {
    processedFilters.canEdit = flattenedFilters.canEdit[0] as boolean;
  }

  // entityId
  if (flattenedFilters.entityId?.length) {
    processedFilters.entityIds = flattenedFilters.entityId as string[];
  }

  // entityType
  if (flattenedFilters.entityType?.length) {
    processedFilters.entityTypes = toEnums(
      flattenedFilters.entityType as string[],
      EventAssociationEntityType
    );
  }

  // id
  if (flattenedFilters.id?.length) {
    const { ids, notIds } = parseIdsAndNotIds(flattenedFilters.id);
    if (ids.length) {
      processedFilters.eventIds = ids.filter(unique);
    }
    if (notIds.length) {
      processedFilters.notEventIds = notIds.filter(unique);
    }
  }

  // term
  if (flattenedFilters.term?.length) {
    processedFilters.title = flattenedFilters.term[0] as string;
  }

  // orgId
  if (flattenedFilters.orgId?.length) {
    processedFilters.orgId = flattenedFilters.orgId[0] as string;
  }

  // categories
  if (flattenedFilters.categories?.length) {
    processedFilters.categories = flattenedFilters.categories as string[];
  }

  // tags
  if (flattenedFilters.tags?.length) {
    processedFilters.tags = flattenedFilters.tags as string[];
  }

  // group
  if (flattenedFilters.group?.length) {
    const { ids, notIds } = parseIdsAndNotIds(flattenedFilters.group);
    if (ids.length) {
      processedFilters.sharedToGroups = ids;
    }
    if (notIds.length) {
      const uniqueIds = notIds.filter(unique);
      // we do not currently have an inverse parameter for `sharedToGroups` at this time. instead, we have separate
      // params for `withoutEditGroups` and `withoutReadGroups`. rather than trying to reconcile whether
      // any given group ID belongs to a view or update group (which would require additional HTTP requests),
      // we simply pass all the ids to both `withoutEditGroups` and `withoutReadGroups`.
      processedFilters.withoutEditGroups = uniqueIds;
      processedFilters.withoutReadGroups = uniqueIds;
    }
  }

  // attendanceType
  if (flattenedFilters.attendanceType?.length) {
    processedFilters.attendanceTypes = toEnums(
      flattenedFilters.attendanceType as string[],
      EventAttendanceType
    );
  }

  // owner
  if (flattenedFilters.owner?.length) {
    processedFilters.createdByIds = flattenedFilters.owner as string[];
  }

  // status
  processedFilters.status = flattenedFilters.status?.length
    ? toEnums(flattenedFilters.status as string[], EventStatus)
    : [EventStatus.PLANNED, EventStatus.CANCELED];

  // if a startDateRange was provided, we prioritize that over individual startDateBefore or startDateAfter
  // filters to prevent collisions
  if (flattenedFilters.startDateRange?.length) {
    // We are explicitly checking if the to and from values are present
    // Because w/ Occurrence, we can have just to or from values
    (flattenedFilters.startDateRange[0] as IDateRange<string | number>).to &&
      (processedFilters.startDateTimeBefore = new Date(
        (flattenedFilters.startDateRange[0] as IDateRange<string | number>).to
      ).toISOString());
    (flattenedFilters.startDateRange[0] as IDateRange<string | number>).from &&
      (processedFilters.startDateTimeAfter = new Date(
        (flattenedFilters.startDateRange[0] as IDateRange<string | number>).from
      ).toISOString());
  } else {
    // startDateBefore
    if (flattenedFilters.startDateBefore?.length) {
      processedFilters.startDateTimeBefore = new Date(
        flattenedFilters.startDateBefore[0] as string | number
      ).toISOString();
    }

    // startDateAfter
    if (flattenedFilters.startDateAfter?.length) {
      processedFilters.startDateTimeAfter = new Date(
        flattenedFilters.startDateAfter[0] as string | number
      ).toISOString();
    }
  }

  // if a endDateRange was provided, we prioritize that over individual endDateBefore or endDateAfter
  // filters to prevent collisions
  if (flattenedFilters.endDateRange?.length) {
    // We are explicitly checking if the to and from values are present
    // Because w/ Occurrence, we can have just to or from values
    (flattenedFilters.endDateRange[0] as IDateRange<string | number>).to &&
      (processedFilters.endDateTimeBefore = new Date(
        (flattenedFilters.endDateRange[0] as IDateRange<string | number>).to
      ).toISOString());
    (flattenedFilters.endDateRange[0] as IDateRange<string | number>).from &&
      (processedFilters.endDateTimeAfter = new Date(
        (flattenedFilters.endDateRange[0] as IDateRange<string | number>).from
      ).toISOString());
  } else {
    // endDateBefore
    if (flattenedFilters.endDateBefore?.length) {
      processedFilters.endDateTimeBefore = new Date(
        flattenedFilters.endDateBefore[0] as string | number
      ).toISOString();
    }

    // endDateAfter
    if (flattenedFilters.endDateAfter?.length) {
      processedFilters.endDateTimeAfter = new Date(
        flattenedFilters.endDateAfter[0] as string | number
      ).toISOString();
    }
  }

  // If there's an occurrence filter, we need to adjust the startDateTimeBefore, startDateTimeAfter
  // Depending on the occurrence.
  if (flattenedFilters.occurrence?.length) {
    flattenedFilters.occurrence.forEach((o) => {
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

  // modified
  if (
    flattenedFilters.modified?.length &&
    (flattenedFilters.modified[0] as IDateRange<string | number>).to &&
    (flattenedFilters.modified[0] as IDateRange<string | number>).from
  ) {
    // range
    processedFilters.updatedAtBefore = new Date(
      (flattenedFilters.modified[0] as IDateRange<string | number>).to
    ).toISOString();
    processedFilters.updatedAtAfter = new Date(
      (flattenedFilters.modified[0] as IDateRange<string | number>).from
    ).toISOString();
  }

  return processedFilters;
}
