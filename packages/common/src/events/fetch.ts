import { PropertyMapper } from "../core/_internal/PropertyMapper";
import { IHubEvent } from "../core/types/IHubEvent";
import { IHubRequestOptions } from "../types";
// import { computeProps } from "./_internal/computeProps";
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
  return getEvent({
    eventId,
    ...requestOptions,
  })
    .then((event) => convertClientEventToHubEvent(event, requestOptions))
    .catch(() => {
      return null;
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
  requestOptions: IHubRequestOptions
): Promise<IHubEvent> {
  const mapper = new PropertyMapper<Partial<IHubEvent>, IEvent>(
    getPropertyMap()
  );
  const hubEvent = mapper.storeToEntity(clientEvent, {}) as IHubEvent;
  // return computeProps(clientEvent, hubEvent, requestOptions);
  return hubEvent;
}
