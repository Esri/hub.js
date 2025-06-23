import { IHubEvent } from "../core/types/IHubEvent";
import { getDefaultEventDatesAndTimes } from "./_internal/getDefaultEventDatesAndTimes";
import {
  EventAccess,
  EventAttendanceType,
  EventStatus,
  IEvent,
} from "./api/orval/api/orval-events";
import { HubEventAttendanceType, HubEventCapacityType } from "./types";

/**
 * Builds a partial IHubEvent (entity) with default values
 */
export function buildDefaultEventEntity(): Partial<IHubEvent> {
  const dates = getDefaultEventDatesAndTimes();
  return {
    access: "private",
    allowRegistration: true,
    attendanceType: HubEventAttendanceType.InPerson,
    catalog: { schemaVersion: 0 },
    categories: [],
    inPersonCapacity: null,
    inPersonCapacityType: HubEventCapacityType.Unlimited,
    isAllDay: false,
    isCanceled: false,
    isDiscussable: true,
    isPlanned: true,
    isRemoved: false,
    name: "",
    notifyAttendees: true,
    onlineCapacity: null,
    onlineCapacityType: HubEventCapacityType.Unlimited,
    onlineDetails: null,
    onlineUrl: null,
    referencedContentIds: [],
    referencedContentIdsByType: [],
    schemaVersion: 1,
    tags: [],
    readGroupIds: [],
    editGroupIds: [],
    ...dates,
    view: {
      heroActions: [],
      showMap: false,
    },
    location: {
      type: "none",
    },
  };
}

/**
 * Builds a partial IEvent (record) with default values
 */
export function buildDefaultEventRecord(): Partial<IEvent> {
  const { startDateTime, endDateTime } = getDefaultEventDatesAndTimes();
  return {
    access: EventAccess.PRIVATE,
    allDay: false,
    allowRegistration: true,
    associations: [],
    attendanceType: [EventAttendanceType.IN_PERSON],
    categories: [],
    inPersonCapacity: null,
    editGroups: [],
    endDateTime: endDateTime.toISOString(),
    notifyAttendees: true,
    readGroups: [],
    startDateTime: startDateTime.toISOString(),
    status: EventStatus.PLANNED,
    tags: [],
    title: "",
    location: null,
  } as Partial<IEvent>;
}
