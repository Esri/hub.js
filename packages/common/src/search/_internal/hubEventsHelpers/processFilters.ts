import { IFilter } from "../../types/IHubCatalog";
import {
  EventAccess,
  EventAssociationEntityType,
  EventAttendanceType,
  EventStatus,
  ISearchEvents,
} from "../../../events/api/orval/api/orval-events";
import { toEnums } from "./toEnumConverters";
import { flattenFilters } from "../hubDiscussionsHelpers/processChannelFilters";
import { unique } from "../../../util";

/**
 * Builds a Partial<ISearchEvents> given an Array of IFilter objects
 * @param filters An Array of IFilter
 * @returns a Partial<ISearchEvents> for the given Array of IFilter objects
 */
export async function processFilters(
  filters: IFilter[]
): Promise<Partial<ISearchEvents>> {
  const flattenedFilters = flattenFilters(filters);
  const eventOptions: Partial<ISearchEvents> = {};

  // access
  if (flattenedFilters.access?.length) {
    eventOptions.access = toEnums(flattenedFilters.access, EventAccess);
  }

  // canEdit
  if (flattenedFilters.canEdit?.length) {
    eventOptions.canEdit = flattenedFilters.canEdit[0];
  }

  // entityId
  if (flattenedFilters.entityId?.length) {
    eventOptions.entityIds = flattenedFilters.entityId;
  }

  // entityType
  if (flattenedFilters.entityType?.length) {
    eventOptions.entityTypes = toEnums(
      flattenedFilters.entityType,
      EventAssociationEntityType
    );
  }

  // id
  if (flattenedFilters.id?.length) {
    eventOptions.eventIds = flattenedFilters.id;
  }

  // term
  if (flattenedFilters.term?.length) {
    eventOptions.title = flattenedFilters.term[0];
  }

  // orgId
  if (flattenedFilters.orgId?.length) {
    eventOptions.orgId = flattenedFilters.orgId[0];
  }

  // categories
  if (flattenedFilters.categories?.length) {
    eventOptions.categories = flattenedFilters.categories;
  }

  // tags
  if (flattenedFilters.tags?.length) {
    eventOptions.tags = flattenedFilters.tags;
  }

  // group
  if (flattenedFilters.group?.length) {
    const { ids, notIds } = flattenedFilters.group.reduce(
      (acc, id) =>
        id.not
          ? {
              ...acc,
              notIds: [
                ...acc.notIds,
                ...(Array.isArray(id.not) ? id.not : [id.not]),
              ],
            }
          : {
              ...acc,
              ids: [...acc.ids, id],
            },
      { ids: [], notIds: [] }
    );
    if (ids.length) {
      eventOptions.sharedToGroups = ids;
    }
    if (notIds.length) {
      const uniqueIds = notIds.filter(unique);
      // we do not currently have an inverse parameter for `sharedToGroups` at this time. instead, we have separate
      // params for `withoutEditGroups` and `withoutReadGroups`. rather than trying to reconcile whether
      // any given group ID belongs to a view or update group (which would require additional HTTP requests),
      // we simply pass all the ids to both `withoutEditGroups` and `withoutReadGroups`.
      eventOptions.withoutEditGroups = uniqueIds;
      eventOptions.withoutReadGroups = uniqueIds;
    }
  }

  // attendanceType
  if (flattenedFilters.attendanceType?.length) {
    eventOptions.attendanceTypes = toEnums(
      flattenedFilters.attendanceType,
      EventAttendanceType
    );
  }

  // owner
  if (flattenedFilters.owner?.length) {
    eventOptions.createdByIds = flattenedFilters.owner;
  }

  // status
  eventOptions.status = flattenedFilters.status?.length
    ? toEnums(flattenedFilters.status, EventStatus)
    : [EventStatus.PLANNED, EventStatus.CANCELED];

  // we support searching for events using date inputs in a few different ways. an `occurrence`
  // filter was implemented as a convenient way to search for events occurring in the past, currently
  // taking place, or in the future. These `occurrence` values need to be mapped to very specific API
  // parameters and values. Additionally, we support searching for events using `startDateRange` and
  // `endDateRange`, which similarly need to be mapped to very specific API parameters and values, which
  // could conflict with `occurrence`. For that reason, if `occurrence` is provided, we ignore any
  // additionally provided `startDateRange` and `endDateRange` predicates. If `occurrence` is omitted but
  // `startDateRange` is provided, `startDateBefore` and `startDateAfter` predicates would be ignored. If
  // `occurrence` is omitted but `endDateRange` is provided, `endDateBefore` and `endDateAfter` predicates
  // would be ignored. If no `occurrence` or `startDateRange` are provided, `startDateBefore` and
  // `startDateAfter` can be used. If no `occurrence` or `endDateRange` are provided, `endDateBefore` and
  // `endDateAfter` can be used.
  if (flattenedFilters.occurrence?.length) {
    // `occurrence` provided, ignore `startDateRange`, `endDateRange`, `startDateBefore`, `startDateAfter`, `endDateBefore` & `endDateAfter`
    const params =
      {
        upcoming: {
          startDateTimeAfter: new Date().toISOString(),
        },
        past: {
          endDateTimeBefore: new Date().toISOString(),
        },
        inProgress: {
          startDateTimeBefore: new Date().toISOString(),
          endDateTimeAfter: new Date().toISOString(),
        },
      }[flattenedFilters.occurrence[0] as "upcoming" | "past" | "inProgress"] ||
      {};
    Object.assign(eventOptions, params);
  } else {
    // `startDateRange` provided, ignore `startDateBefore` & `startDateAfter`
    if (flattenedFilters.startDateRange?.length) {
      eventOptions.startDateTimeBefore = new Date(
        flattenedFilters.startDateRange[0].to
      ).toISOString();
      eventOptions.startDateTimeAfter = new Date(
        flattenedFilters.startDateRange[0].from
      ).toISOString();
    } else {
      // startDateBefore
      if (flattenedFilters.startDateBefore?.length) {
        eventOptions.startDateTimeBefore = new Date(
          flattenedFilters.startDateBefore[0]
        ).toISOString();
      }

      // startDateAfter
      if (flattenedFilters.startDateAfter?.length) {
        eventOptions.startDateTimeAfter = new Date(
          flattenedFilters.startDateAfter[0]
        ).toISOString();
      }
    }

    // `endDateRange` provided, ignore `endDateBefore` & `endDateAfter`
    if (flattenedFilters.endDateRange?.length) {
      eventOptions.endDateTimeBefore = new Date(
        flattenedFilters.endDateRange[0].to
      ).toISOString();
      eventOptions.endDateTimeAfter = new Date(
        flattenedFilters.endDateRange[0].from
      ).toISOString();
    } else {
      // endDateBefore
      if (flattenedFilters.endDateBefore?.length) {
        eventOptions.endDateTimeBefore = new Date(
          flattenedFilters.endDateBefore[0]
        ).toISOString();
      }

      // endDateAfter
      if (flattenedFilters.endDateAfter?.length) {
        eventOptions.endDateTimeAfter = new Date(
          flattenedFilters.endDateAfter[0]
        ).toISOString();
      }
    }
  }

  return eventOptions;
}
