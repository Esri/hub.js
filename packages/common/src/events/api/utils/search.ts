import { IHubSearchResult } from "../../../search/types/IHubSearchResult";
import { IRegistration } from "../orval/api/orval-events";
import { AccessLevel } from "../../../core";
import { getUser, IUser } from "@esri/arcgis-rest-portal";

/**
 * Transforms a given event attendee into a IHubSearchResult
 * @param attendee
 * @returns
 */
export const eventAttendeeToSearchResult = async (
  attendee: IRegistration
): Promise<IHubSearchResult> => {
  const user: IUser = await getUser(attendee.userId);
  const access: AccessLevel = user.access as AccessLevel;
  return {
    ...attendee,
    id: String(attendee.id),
    name: user.fullName,
    createdDate: new Date(attendee.createdAt),
    createdDateSource: "attendee.createdAt",
    updatedDate: new Date(attendee.updatedAt),
    updatedDateSource: "attendee.updatedAt",
    access,
    type: "Event Attendee",
    family: "eventAttendees",
    rawResult: attendee,
  };
};
