import { getUser } from "@esri/arcgis-rest-portal";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";
import { IHubSearchResult } from "../../types/IHubSearchResult";
import { IEvent } from "../../../events/api/orval/api/orval-events";
import { AccessLevel } from "../../../core/types/types";
import { HubFamily } from "../../../types";
import { computeLinks } from "../../../events/_internal/computeLinks";
import { getLocationFromEvent } from "../../../events/_internal/getLocationFromEvent";

/**
 * Resolves an IHubSearchResult for the given IEvent record
 * @param event An IEvent record
 * @param options An IHubSearchOptions object
 * @returns a IHubSearchResult for the given IEvent record
 */
export async function eventToSearchResult(
  event: IEvent,
  options: IHubSearchOptions
): Promise<IHubSearchResult> {
  const ownerUser = await getUser({
    username: event.creator.username,
    ...options.requestOptions,
  });
  const result = {
    access: event.access.toLowerCase() as AccessLevel,
    id: event.id,
    location: getLocationFromEvent(event),
    type: "Event",
    name: event.title,
    owner: event.creator.username,
    ownerUser,
    summary: event.summary || event.description,
    createdDate: new Date(event.createdAt),
    createdDateSource: "event.createdAt",
    updatedDate: new Date(event.updatedAt),
    updatedDateSource: "event.updatedAt",
    family: "event" as HubFamily,
    links: computeLinks(event),
    tags: event.tags,
    categories: event.categories,
    rawResult: event,
  };
  return result;
}
