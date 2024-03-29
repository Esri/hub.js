import {
  IPropertyMap,
  mapEntityToStore,
  mapStoreToEntity,
} from "../../core/_internal/PropertyMapper";
import { IHubEvent } from "../../core/types/IHubEvent";
import { SettableAccessLevel } from "../../core/types/types";
import {
  EventAccess,
  EventAttendanceType,
  EventStatus,
  IEvent,
  IOnlineMeeting,
} from "../api/orval/api/orval-events";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

function getTimeZoneISOStringFromLocalDateTime(
  date: string,
  time: string,
  timeZone: string
): string {
  const timeZoneDateTime = dayjs.tz([date, time].join(" "), timeZone);
  return timeZoneDateTime.toISOString();
}

export class PropertyMapper {
  public mappings: IPropertyMap[];
  /**
   * Pass in the mappings between the Entity and
   * it's backing structure (model or otherwise)
   * @param mappings
   */
  constructor(mappings: IPropertyMap[]) {
    this.mappings = mappings;
  }
  /**
   * Map properties from a Store object, on to an Entity object.
   *
   * Used when constructing an Entity from a fetched Store object,
   * in which case the Entity should be an empty object (`{}`).
   *
   * Can also be used to apply changes to an Entity from a Store,
   * in which case an existing Entity can be passed in.
   * @param store
   * @param entity
   * @returns
   */
  storeToEntity(
    store: Partial<IEvent>,
    entity: Partial<IHubEvent>
  ): Partial<IHubEvent> {
    // TODO: support locations
    // TODO: thumbnail & thumbnail url

    const obj = mapStoreToEntity(store, entity, this.mappings);

    obj.type = "Event";
    obj.access = store.access.toLowerCase() as SettableAccessLevel;
    obj.isCanceled = store.status === EventStatus.CANCELED;
    obj.isPlanned = store.status === EventStatus.PLANNED;
    obj.isRemoved = store.status === EventStatus.REMOVED;
    if (
      store.attendanceType.includes(EventAttendanceType.IN_PERSON) &&
      store.attendanceType.includes(EventAttendanceType.VIRTUAL)
    ) {
      obj.attendanceType = "both";
    } else if (store.attendanceType.includes(EventAttendanceType.IN_PERSON)) {
      obj.attendanceType = "inPerson";
    } else {
      obj.attendanceType = "online";
    }
    obj.inPersonCapacity = store.addresses?.[0]?.capacity ?? null;
    obj.onlineCapacity = store.onlineMeetings?.[0]?.capacity ?? null;
    obj.onlineDetails = store.onlineMeetings?.[0]?.details ?? null;
    obj.onlineUrl = store.onlineMeetings?.[0]?.url ?? null;
    obj.canChangeAccess = [
      store.permission.canSetAccessToPublic,
      store.permission.canSetAccessToOrg,
      store.permission.canSetAccessToPrivate,
    ].some(Boolean);

    // Handle Dates
    obj.createdDate = new Date(store.createdAt);
    obj.startDateTime = new Date(store.startDateTime);
    obj.endDateTime = new Date(store.endDateTime);
    obj.createdDateSource = "createdAt";
    obj.updatedDate = new Date(store.updatedAt);
    obj.updatedDateSource = "updatedAt";

    return obj;
  }

  entityToStore(
    entity: Partial<IHubEvent>,
    store: Partial<IEvent>
  ): Partial<IEvent> {
    // TODO: support locations
    // TODO: thumbnail & thumbnail url

    const obj = mapEntityToStore(entity, store, this.mappings);

    obj.access = entity.access.toUpperCase() as EventAccess;

    if (entity.isRemoved) {
      obj.status = EventStatus.REMOVED;
    } else if (entity.isCanceled) {
      obj.status = EventStatus.CANCELED;
    } else {
      obj.status = EventStatus.PLANNED;
    }

    if (entity.attendanceType === "both") {
      obj.attendanceType = [
        EventAttendanceType.IN_PERSON,
        EventAttendanceType.VIRTUAL,
      ];
    } else if (entity.attendanceType === "inPerson") {
      obj.attendanceType = [EventAttendanceType.IN_PERSON];
    } else {
      obj.attendanceType = [EventAttendanceType.VIRTUAL];
    }

    if (["online", "both"].includes(entity.attendanceType)) {
      obj.onlineMeetings = [
        {
          details: entity.onlineDetails,
          capacity: entity.onlineCapacity,
          url: entity.onlineUrl,
        } as IOnlineMeeting,
      ];
    }

    const { startDate } = entity;
    // single-day events are created from new-menu, i.e. no endDate field provided
    // so set endDate to startDate
    const endDate = startDate;
    let { startTime, endTime } = entity;
    // override startTime & endTime for all-day events
    if (entity.isAllDay) {
      startTime = "00:00:00";
      endTime = "23:59:59";
    }
    // build start & end date/time iso strings, adjusted for desired time zone
    obj.startDateTime = getTimeZoneISOStringFromLocalDateTime(
      startDate,
      startTime,
      entity.timeZone
    );
    obj.endDateTime = getTimeZoneISOStringFromLocalDateTime(
      endDate,
      endTime,
      entity.timeZone
    );

    return obj;
  }
}
