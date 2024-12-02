import { IHubEvent } from "../core/types/IHubEvent";
import { IHubRequestOptions } from "../types";
import { getPropertyMap } from "./_internal/getPropertyMap";
import { EventPropertyMapper } from "./_internal/PropertyMapper";
import { buildDefaultEventEntity, buildDefaultEventRecord } from "./defaults";
import {
  createEvent as createEventApi,
  deleteEvent as deleteEventApi,
  updateEvent as updateEventApi,
} from "./api/events";
import {
  createRegistration,
  deleteRegistration,
  EventAttendanceType,
  IRegistration,
  RegistrationRole,
} from "./api";
import { buildEventAssociations } from "./_internal/buildEventAssociations";

export interface IHubCreateEventRegistration {
  eventId: string;
  role: RegistrationRole;
  type: EventAttendanceType;
}

/**
 * @private
 * Create a new Hub Event item
 *
 * Minimal properties are name and orgUrlKey
 *
 * @param partialEvent a partial event
 * @param requestOptions user request options
 * @returns promise that resolves an IHubEvent
 */
export async function createHubEvent(
  partialEvent: Partial<IHubEvent>,
  requestOptions: IHubRequestOptions
): Promise<IHubEvent> {
  const event = { ...buildDefaultEventEntity(), ...partialEvent };

  // single-day events are created from new-menu, i.e. no endDate field provided
  // so set endDate to startDate
  event.endDate = event.startDate;

  // TODO: how to handle events being discussable vs non-discussable

  const mapper = new EventPropertyMapper(getPropertyMap());

  let model = mapper.entityToStore(event, buildDefaultEventRecord());

  const associations = await buildEventAssociations(
    partialEvent.referencedContentIdsByType,
    partialEvent.referencedContentIds,
    requestOptions
  );

  const data = {
    access: model.access,
    allDay: model.allDay,
    allowRegistration: model.allowRegistration,
    associations,
    attendanceType: model.attendanceType,
    categories: model.categories,
    description: model.description,
    editGroups: model.editGroups,
    endDate: model.endDate,
    endTime: model.endTime,
    inPersonCapacity: model.inPersonCapacity,
    notifyAttendees: model.notifyAttendees,
    onlineMeeting: model.onlineMeeting,
    readGroups: model.readGroups,
    startDate: model.startDate,
    startTime: model.startTime,
    summary: model.summary,
    tags: model.tags,
    timeZone: model.timeZone,
    title: model.title,
    location: model.location,
  };

  model = await createEventApi({
    data,
    ...requestOptions,
  });

  return mapper.storeToEntity(model, {}) as IHubEvent;
}

/**
 * @private
 * Update a Hub Event
 * @param event the event to update
 * @param requestOptions user request options
 * @returns promise that resolves a IHubEvent
 */
export async function updateHubEvent(
  partialEvent: Partial<IHubEvent>,
  requestOptions: IHubRequestOptions
): Promise<IHubEvent> {
  const eventUpdates = { ...buildDefaultEventEntity(), ...partialEvent };

  // TODO: how to handle events being discussable vs non-discussable

  const mapper = new EventPropertyMapper(getPropertyMap());

  let model = mapper.entityToStore(eventUpdates, buildDefaultEventRecord());

  const associations = await buildEventAssociations(
    partialEvent.referencedContentIdsByType,
    partialEvent.referencedContentIds,
    requestOptions
  );

  const data = {
    access: model.access,
    allDay: model.allDay,
    allowRegistration: model.allowRegistration,
    associations,
    attendanceType: model.attendanceType,
    categories: model.categories,
    description: model.description?.trim() || null,
    editGroups: model.editGroups,
    endDate: model.endDate,
    endTime: model.endTime,
    inPersonCapacity: model.inPersonCapacity,
    notifyAttendees: model.notifyAttendees,
    onlineMeeting: model.onlineMeeting,
    readGroups: model.readGroups,
    startDate: model.startDate,
    startTime: model.startTime,
    status: model.status,
    summary: model.summary?.trim() || null,
    tags: model.tags,
    timeZone: model.timeZone,
    title: model.title,
    location: model.location,
  };

  model = await updateEventApi({
    eventId: model.id,
    data,
    ...requestOptions,
  });

  return mapper.storeToEntity(model, {}) as IHubEvent;
}

export async function deleteHubEvent(
  id: string,
  requestOptions: IHubRequestOptions
): Promise<void> {
  // TODO: update `status` of event to `"removed"` when requestOptions.params.parementDelete is `true`
  // instead of permanently deleting the event when we officially support recycle bin behavior
  await deleteEventApi({
    eventId: id,
    ...requestOptions,
  });
}

/**
 * @private
 * Create an Event registration
 * @param data
 * @param requestOptions
 * @returns Promise<void>
 */
export function createHubEventRegistration(
  data: IHubCreateEventRegistration,
  requestOptions: IHubRequestOptions
): Promise<IRegistration> {
  return createRegistration({ data, ...requestOptions });
}

/**
 * @private
 * Remove an Event Attendee
 * @param id event attendee id
 * @param requestOptions
 * @returns Promise<void>
 */
export async function deleteHubEventRegistration(
  id: string,
  requestOptions: IHubRequestOptions
): Promise<void> {
  await deleteRegistration({ registrationId: id, ...requestOptions });
}
