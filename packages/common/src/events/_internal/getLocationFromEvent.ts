import { IHubLocation } from "../../core/types/IHubLocation";
import { IEvent } from "../api/orval/api/orval-events";

export function getLocationFromEvent(event: Partial<IEvent>): IHubLocation {
  return event.location
    ? {
        type: event.location.type,
        spatialReference: event.location.spatialReference,
        extent: event.location.extent,
        geometries: event.location.geometries,
      }
    : { type: "none" };
}
