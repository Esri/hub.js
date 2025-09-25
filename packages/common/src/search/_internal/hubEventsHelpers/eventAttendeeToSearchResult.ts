import { IHubSearchResult } from "../../types/IHubSearchResult";
import { IRegistration } from "../../../events/api/orval/api/orval-events";
import { getUser } from "@esri/arcgis-rest-portal";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";
import { getUserHomeUrl } from "../../../urls/getUserHomeUrl";
import { getUserThumbnailUrl } from "../../utils";
import { AccessLevel } from "../../../core/types/types";

/**
 * Transforms a given event attendee into a IHubSearchResult
 * @param attendee
 * @returns
 */
export async function eventAttendeeToSearchResult(
  attendee: IRegistration,
  options: IHubSearchOptions
): Promise<IHubSearchResult> {
  const [user, creator] = await Promise.all([
    getUser({
      username: attendee.userId,
      ...options.requestOptions,
    }),
    getUser({
      username: attendee.createdById,
      ...options.requestOptions,
    }),
  ]);
  return {
    id: attendee.id.toString(),
    access: user.access as AccessLevel,
    name: user.fullName,
    createdDate: new Date(attendee.createdAt),
    createdDateSource: "attendee.createdAt",
    updatedDate: new Date(attendee.updatedAt),
    updatedDateSource: "attendee.updatedAt",
    type: "Event Attendee",
    family: "eventAttendee",
    owner: creator.username,
    rawResult: attendee,
    links: {
      self: getUserHomeUrl(user.username, options.requestOptions),
      siteRelative: `/people/${user.username}`,
      thumbnail: user.thumbnail
        ? getUserThumbnailUrl(
            options.requestOptions.portal,
            user,
            options.requestOptions.authentication?.token
          )
        : null,
    },
  };
}
