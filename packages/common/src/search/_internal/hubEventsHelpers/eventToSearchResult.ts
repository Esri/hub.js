import { IHubSearchOptions } from "../../types/IHubSearchOptions";
import { IHubSearchResult } from "../../types/IHubSearchResult";
import { IEvent } from "../../../events/api/orval/api/orval-events";
import { AccessLevel } from "../../../core/types/types";
import { HubFamily } from "../../../types";
import { computeLinks } from "../../../events/_internal/computeLinks";

export function eventToSearchResult(
  event: IEvent,
  options: IHubSearchOptions
): IHubSearchResult {
  const result = {
    access: event.access.toLowerCase() as AccessLevel,
    id: event.id,
    type: "Event",
    name: event.title,
    owner: event.creator.username,
    ownerUser: event.creator,
    summary: event.summary,
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
