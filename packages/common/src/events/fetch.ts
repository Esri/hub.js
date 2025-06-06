import { EventPropertyMapper } from "./_internal/PropertyMapper";
import { IHubEvent } from "../core/types/IHubEvent";
import { IHubRequestOptions } from "../hub-types";
import { getPropertyMap } from "./_internal/getPropertyMap";
import { getEvent } from "./api/events";
import { IEvent } from "./api/orval/api/orval-events";

/**
 * @private
 * Get an Event by id or slug
 * @param identifier event id or slug
 * @param requestOptions request options
 * @returns a promise that resolves an IHubEvent
 */
export function fetchEvent(
  eventId: string,
  requestOptions: IHubRequestOptions
): Promise<IHubEvent> {
  const spl = eventId.split("-");
  const id = spl[spl.length - 1];
  return getEvent({
    eventId: id,
    data: {
      include: "associations",
    },
    ...requestOptions,
  })
    .then((event) => convertClientEventToHubEvent(event, requestOptions))
    .catch(() => {
      throw new Error("Failed to fetch event.");
    });
}

/**
 * @private
 * Convert a client event record into a Hub Event
 * @param clientEvent the client event record
 * @param requestOptions request options
 * @returns a promise that resolves a IHubEvent
 */
export async function convertClientEventToHubEvent(
  clientEvent: IEvent,
  _requestOptions: IHubRequestOptions
): Promise<IHubEvent> {
  const mapper = new EventPropertyMapper(getPropertyMap());
  return Promise.resolve(mapper.storeToEntity(clientEvent, {}) as IHubEvent);
}
