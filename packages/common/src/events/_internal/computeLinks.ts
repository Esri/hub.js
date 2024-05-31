import { IHubEntityLinks } from "../../core/types";
import { getRelativeWorkspaceUrl } from "../../core/getRelativeWorkspaceUrl";
import { getHubRelativeUrl } from "../../content/_internal/internalContentUtils";
import { IEvent } from "../api/orval/api/orval-events";
import { getEventSlug } from "./getEventSlug";
import { getEventThumbnail } from "./getEventThumbnail";

/**
 * Compute the links that get appended to a Hub Event
 * search result and entity
 *
 * @param item
 * @param requestOptions
 */
export function computeLinks(event: IEvent): IHubEntityLinks {
  const siteRelative = getHubRelativeUrl("event", getEventSlug(event));
  return {
    self: siteRelative,
    siteRelative,
    siteRelativeEntityType: getHubRelativeUrl("event"),
    workspaceRelative: getRelativeWorkspaceUrl("Event", event.id),
    thumbnail: getEventThumbnail(),
  };
}
