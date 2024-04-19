import { IHubSearchResult } from "../../../search/types/IHubSearchResult";
import { IRegistration } from "../orval/api/orval-events";
import { AccessLevel } from "../../../core";

/**
 * Transforms a given event attendee into a IHubSearchResult
 * @param attendee
 * @returns
 */
export const eventAttendeeToSearchResult = (
  attendee: IRegistration
): IHubSearchResult => {
  const access: AccessLevel =
    attendee.event?.access.toLowerCase() as AccessLevel;
  return {
    ...attendee,
    id: String(attendee.id),
    name: attendee.user?.username,
    createdDate: new Date(attendee.createdAt),
    createdDateSource: "attendee.createdAt",
    updatedDate: new Date(attendee.updatedAt),
    updatedDateSource: "attendee.updatedAt",
    access,
    type: "Event Attendee",
    family: "eventAttendee",
    rawResult: attendee,
  };
};
