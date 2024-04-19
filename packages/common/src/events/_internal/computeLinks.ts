import { IHubEntityLinks } from "../../core/types";
import { getRelativeWorkspaceUrl } from "../../core/getRelativeWorkspaceUrl";
import { getHubRelativeUrl } from "../../content/_internal/internalContentUtils";
import { IEvent } from "../api/orval/api/orval-events";
import { getEventSlug } from "./getEventSlug";

/**
 * Compute the links that get appended to a Hub Event
 * search result and entity
 *
 * @param item
 * @param requestOptions
 */
export function computeLinks(event: IEvent): IHubEntityLinks {
  return {
    self: "not-implemented",
    siteRelative: getHubRelativeUrl("event", getEventSlug(event)), // TODO: this should be the slug
    workspaceRelative: getRelativeWorkspaceUrl("Event", event.id),
    thumbnail: "not-implemented",
  };
}
