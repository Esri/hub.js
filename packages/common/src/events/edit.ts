import { IHubEvent } from "../core/types/IHubEvent";
import { IHubRequestOptions } from "../types";
import { getPropertyMap } from "./_internal/getPropertyMap";
import { EventPropertyMapper } from "./_internal/PropertyMapper";
import { buildDefaultEventEntity, buildDefaultEventRecord } from "./defaults";
import {
  createEvent as createEventApi,
  updateEvent as updateEventApi,
} from "./api/events";

/**
 * @private
 * Create a new Hub Event item
 *
 * Minimal properties are name and orgUrlKey
 *
 * @param partialEvent a partial event
 * @param requestOptions user request options
 * @returns promise that resolves a IHubEvent
 */
export async function createHubEvent(
  partialEvent: Partial<IHubEvent>,
  requestOptions: IHubRequestOptions
): Promise<IHubEvent> {
  const event = { ...buildDefaultEventEntity(), ...partialEvent };

  // single-day events are created from new-menu, i.e. no endDate field provided
  // so set endDate to startDate
  event.endDate = event.startDate;

  // TODO: how to handle slugs
  // TODO: how to handle events being discussable vs non-discussable

  const mapper = new EventPropertyMapper(getPropertyMap());

  let model = mapper.entityToStore(event, buildDefaultEventRecord());

  const data = {
    access: model.access,
    addresses: model.addresses,
    allDay: model.allDay,
    allowRegistration: model.allowRegistration,
    attendanceType: model.attendanceType,
    categories: model.categories,
    description: model.description,
    editGroups: model.editGroups,
    endDateTime: model.endDateTime,
    notifyAttendees: model.notifyAttendees,
    onlineMeetings: model.onlineMeetings,
    readGroups: model.readGroups,
    startDateTime: model.startDateTime,
    summary: model.summary,
    tags: model.tags,
    timeZone: model.timeZone,
    title: model.title,
    // TODO: locations
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
  event: IHubEvent,
  requestOptions: IHubRequestOptions
): Promise<IHubEvent> {
  const eventUpdates = { ...buildDefaultEventEntity(), ...event };

  // TODO: how to handle slugs
  // TODO: how to handle events being discussable vs non-discussable

  const mapper = new EventPropertyMapper(getPropertyMap());

  let model = mapper.entityToStore(eventUpdates, buildDefaultEventRecord());

  const data = {
    access: model.access,
    addresses: model.addresses,
    allDay: model.allDay,
    allowRegistration: model.allowRegistration,
    attendanceType: model.attendanceType,
    categories: model.categories,
    description: model.description,
    editGroups: model.editGroups,
    endDateTime: model.endDateTime,
    notifyAttendees: model.notifyAttendees,
    onlineMeetings: model.onlineMeetings,
    readGroups: model.readGroups,
    startDateTime: model.startDateTime,
    status: model.status,
    summary: model.summary,
    tags: model.tags,
    timeZone: model.timeZone,
    title: model.title,
    // TODO: locations
  };

  model = await updateEventApi({
    eventId: model.id,
    data,
    ...requestOptions,
  });

  return mapper.storeToEntity(model, {}) as IHubEvent;
}
