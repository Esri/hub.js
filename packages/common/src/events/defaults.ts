import { IHubEvent } from "../core/types/IHubEvent";
import { getDefaultEventDatesAndTimes } from "./_internal/getDefaultEventDatesAndTimes";
import {
  EventAccess,
  EventAttendanceType,
  EventStatus,
  IEvent,
} from "./api/orval/api/orval-events";

export function buildDefaultEventEntity(): Partial<IHubEvent> {
  const dates = getDefaultEventDatesAndTimes();
  return {
    access: "private",
    allowRegistration: true,
    attendanceType: "inPerson",
    categories: [],
    inPersonCapacity: null,
    isAllDay: false,
    isCanceled: false,
    isDiscussable: true,
    isPlanned: true,
    isRemoved: false,
    name: "",
    notifyAttendees: true,
    onlineCapacity: null,
    onlineDetails: null,
    onlineUrl: null,
    references: [],
    schemaVersion: 1,
    tags: [],
    ...dates,
    // TODO: groups
  };
}

export function buildDefaultEventRecord(): Partial<IEvent> {
  const { startDateTime, endDateTime } = getDefaultEventDatesAndTimes();
  return {
    access: EventAccess.PRIVATE,
    allDay: false,
    allowRegistration: true,
    attendanceType: [EventAttendanceType.IN_PERSON],
    categories: [],
    editGroups: [],
    endDateTime: endDateTime.toISOString(),
    notifyAttendees: true,
    readGroups: [],
    startDateTime: startDateTime.toISOString(),
    status: EventStatus.PLANNED,
    tags: [],
    title: "",
  } as Partial<IEvent>;
}
