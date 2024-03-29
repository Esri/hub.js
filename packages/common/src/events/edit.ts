import { IHubEvent } from "../core/types/IHubEvent";
import { IHubRequestOptions } from "../types";
import { getPropertyMap } from "./_internal/getPropertyMap";
import { PropertyMapper } from "./_internal/PropertyMapper";
import { buildDefaultEventEntity, buildDefaultEventRecord } from "./defaults";
import { createEvent as createEventApi } from "./api/events";

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
export async function createEvent(
  partialEvent: Partial<IHubEvent>,
  requestOptions: IHubRequestOptions
): Promise<IHubEvent> {
  // throw new Error('not implemented');
  const event = { ...buildDefaultEventEntity(), ...partialEvent };

  // TODO: how to handle slugs
  // TODO: how to handle events being discussable vs non-discussable

  const mapper = new PropertyMapper(getPropertyMap());

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
    // TODO: groups
    // TODO: locations
  };

  model = await createEventApi({
    data,
    ...requestOptions,
  });

  const newEvent = mapper.storeToEntity(model, {});
  // newEvent = computeProps(model, newEvent, requestOptions);
  return newEvent as IHubEvent;
}

/**
 * @private
 * Update a Hub Event
 * @param event the event to update
 * @param requestOptions user request options
 * @returns promise that resolves a IHubEvent
 */
export async function updateEvent(
  discussion: IHubEvent,
  requestOptions: IHubRequestOptions
): Promise<IHubEvent> {
  throw new Error("not implemented");
}
