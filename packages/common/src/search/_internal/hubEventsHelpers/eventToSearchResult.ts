import { IHubSearchOptions } from "../../types/IHubSearchOptions";
import { IHubSearchResult } from "../../types/IHubSearchResult";
import {
  // EventAttendanceType,
  IEvent,
  // IPagedRegistrationResponse,
  // RegistrationStatus,
} from "../../../events/api/orval/api/orval-events";
import { AccessLevel } from "../../../core/types/types";
import { HubFamily } from "../../../types";
import { getRegistrations } from "../../../events/api/registrations";
import { computeLinks } from "../../../events/_internal/computeLinks";

export async function eventToSearchResult(
  event: IEvent,
  options: IHubSearchOptions
): Promise<IHubSearchResult> {
  // const { total, items: attendees } = event.allowRegistration
  //   ? await getRegistrations({
  //       data: {
  //         eventId: event.id,
  //         status: RegistrationStatus.ACCEPTED,
  //         num: "1",
  //       },
  //       ...options.requestOptions,
  //     })
  //   : ({ total: 0, items: [] } as IPagedRegistrationResponse);
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
    // status: event.status,
    // startDateTime: new Date(event.startDateTime),
    // endDateTime: new Date(event.endDateTime),
    // numAttendeesTotal: total,
    // attendanceType: event.attendanceType.map((attendanceType) =>
    //   attendanceType.toLowerCase()
    // ),
    // onlineUrl: event.onlineMeetings?.[0].url,
    // onlineCapacity: event.onlineMeetings?.[0].capacity,
    // onlineAttendance: attendees.filter(
    //   (attendee) => attendee.type === EventAttendanceType.VIRTUAL
    // ).length,
    // inPersonAddress: event.addresses?.[0].address,
    // inPersonCapacity: event.addresses?.[0].capacity,
    // inPersonAttendance: attendees.filter(
    //   (attendee) => attendee.type === EventAttendanceType.IN_PERSON
    // ).length,
  };
  return result;
}
