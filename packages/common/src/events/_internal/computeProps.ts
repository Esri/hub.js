import { IRequestOptions } from "@esri/arcgis-rest-request";
import { SettableAccessLevel, IHubEvent } from "../../core";
import {
  EventAttendanceType,
  EventStatus,
  IEvent,
} from "../api/orval/api/orval-events";
import { cloneObject } from "../../util";

// TODO: remove, these transforms were moved into the custom PropertyMapper

/**
 * Given an IEvent (db record) and an IHubEvent (entity), set various computed properties that can't be directly mapped
 * @private
 * @param model The IEvent model, i.e. the event model from the Events API client
 * @param event A partial IHubEvent model
 * @param requestOptions An IRequestOptions object
 * @returns an IHubEvent
 */
export function computeProps(
  model: IEvent,
  event: Partial<IHubEvent>,
  requestOptions: IRequestOptions
): IHubEvent {
  // compute base properties on discussion
  const computedEvent = cloneObject(event);

  computedEvent.access = event.access.toLowerCase() as SettableAccessLevel;

  computedEvent.isCanceled = model.status === EventStatus.CANCELED;
  computedEvent.isPlanned = model.status === EventStatus.PLANNED;
  computedEvent.isRemoved = model.status === EventStatus.REMOVED;
  computedEvent.isInPerson = model.attendanceType.includes(
    EventAttendanceType.IN_PERSON
  );
  computedEvent.isOnline = model.attendanceType.includes(
    EventAttendanceType.VIRTUAL
  );
  computedEvent.inPersonCapacity = model.addresses?.[0]?.capacity ?? null;
  computedEvent.onlineCapacity = model.onlineMeetings?.[0]?.capacity ?? null;
  computedEvent.onlineUrl = model.onlineMeetings?.[0]?.url ?? null;

  // TODO: thumbnail & thumbnail url

  // Handle Dates
  computedEvent.createdDate = new Date(model.createdAt);
  computedEvent.startDateTime = new Date(model.startDateTime);
  computedEvent.endDateTime = new Date(model.endDateTime);
  computedEvent.createdDateSource = "createdAt";
  computedEvent.updatedDate = new Date(model.updatedAt);
  computedEvent.updatedDateSource = "updatedAt";

  // cast b/c this takes a partial but returns a full object
  return computedEvent as IHubEvent;
}
