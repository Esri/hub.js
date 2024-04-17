import {
  EventAccess,
  EventAttendanceType,
  EventStatus,
  IEvent,
  IRegistration,
  IUser,
  RegistrationRole,
  RegistrationStatus,
} from "../../../../src/events/api/orval/api/orval-events";
import { eventAttendeeToSearchResult } from "../../../../src/events/api/utils/search";

describe("event search utils", () => {
  describe("eventAttendeeToSearchResult", () => {
    it("should convert attendee to search result", () => {
      const user: IUser = {
        agoId: "an arcgis online id",
        createdAt: "2024-04-17T15:30:42+0000",
        deleted: false,
        email: "anemail@server.com",
        firstName: "John",
        lastName: "Green",
        optedOut: false,
        updatedAt: "2024-04-17T15:30:42+0000",
        username: "fishingboatproceeds",
      };
      const event: IEvent = {
        access: EventAccess.PRIVATE,
        allDay: false,
        allowRegistration: true,
        attendanceType: [EventAttendanceType.VIRTUAL],
        catalog: null,
        categories: [],
        createdAt: "2024-04-17T15:30:42+0000",
        createdById: "a creator id",
        description: "",
        editGroups: [],
        endDateTime: "2024-04-17T15:30:42+0000",
        geometry: null,
        id: "an event id",
        notifyAttendees: false,
        orgId: "an organization id",
        permission: {
          canDelete: true,
          canEdit: true,
          canSetAccessToOrg: true,
          canSetAccessToPrivate: true,
          canSetAccessToPublic: true,
          canSetStatusToCancelled: true,
          canSetStatusToRemoved: true,
        },
        readGroups: [],
        recurrence: null,
        startDateTime: "2024-04-17T15:30:42+0000",
        status: EventStatus.PLANNED,
        summary: "",
        tags: [],
        timeZone: "EST",
        title: "a title",
        updatedAt: "2024-04-17T15:30:42+0000",
      };
      const attendee: IRegistration = {
        createdAt: "2024-04-17T15:30:42+0000",
        createdById: "a creator id",
        eventId: "an event id",
        id: 0,
        permission: {
          canDelete: true,
          canEdit: true,
        },
        role: RegistrationRole.OWNER,
        status: RegistrationStatus.PENDING,
        type: EventAttendanceType.VIRTUAL,
        updatedAt: "2024-04-17T15:30:42+0000",
        user,
        userId: "a user id",
        event,
      };
      const result = eventAttendeeToSearchResult(attendee);
      expect(result).toEqual({
        ...attendee,
        id: String(attendee.id),
        name: "fishingboatproceeds",
        createdDate: new Date(attendee.createdAt),
        createdDateSource: "registration",
        updatedDate: new Date(attendee.updatedAt),
        updatedDateSource: "registration",
        access: "private",
        type: "eventAttendee",
        family: "event",
        rawResult: attendee,
      });
    });
  });
});
