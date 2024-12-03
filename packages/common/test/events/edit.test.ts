import * as PortalModule from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as defaultsModule from "../../src/events/defaults";
import * as eventsModule from "../../src/events/api/events";
import * as registrationModule from "../../src/events/api";
import {
  EventAccess,
  EventAttendanceType,
  EventStatus,
  IEvent,
  IEventAssociation,
} from "../../src/events/api/types";
import {
  createHubEvent,
  createHubEventRegistration,
  deleteHubEvent,
  deleteHubEventRegistration,
  IHubCreateEventRegistration,
  updateHubEvent,
} from "../../src/events/edit";
import { IHubEvent } from "../../src/core/types/IHubEvent";
import {
  HubEventAttendanceType,
  HubEventCapacityType,
} from "../../src/events/types";
import * as buildEventAssociationsModule from "../../src/events/_internal/buildEventAssociations";
import { IArcGISContext } from "../../src/ArcGISContext";

describe("HubEvents edit module", () => {
  const context = {
    authentication: MOCK_AUTH,
    currentUser: {
      username: "casey",
    } as unknown as PortalModule.IUser,
    portal: {
      name: "DC R&D Center",
      id: "BRXFAKE",
      urlKey: "fake-org",
    } as unknown as PortalModule.IPortal,
    portalUrl: "https://myserver.com",
  } as unknown as IArcGISContext;

  const datesAndTimes = {
    startDate: "2024-03-31",
    startDateTime: new Date(),
    startTime: "12:00:00",
    endDate: "2024-03-31",
    endDateTime: new Date(),
    endTime: "14:00:00",
    timeZone: "America/New_York",
  };

  const defaultRecord: Partial<IEvent> = {
    access: EventAccess.PRIVATE,
    allDay: false,
    allowRegistration: true,
    attendanceType: [EventAttendanceType.IN_PERSON],
    associations: [],
    categories: [],
    editGroups: [],
    endDateTime: datesAndTimes.endDateTime.toISOString(),
    endDate: datesAndTimes.endDate,
    endTime: datesAndTimes.endTime,
    inPersonCapacity: 50,
    notifyAttendees: true,
    readGroups: [],
    registrationCount: {
      inPerson: 0,
      virtual: 5,
    },
    startDateTime: datesAndTimes.startDateTime.toISOString(),
    startDate: datesAndTimes.startDate,
    startTime: datesAndTimes.startTime,
    status: EventStatus.PLANNED,
    tags: [],
    title: "",
    permission: {
      canDelete: true,
      canSetAccessToOrg: true,
      canSetAccessToPrivate: true,
      canSetStatusToCancelled: true,
      canEdit: true,
      canSetAccessToPublic: true,
      canSetStatusToRemoved: true,
    },
    timeZone: "America/New_York",
    description: null,
    summary: null,
  };

  const defaultEntity: Partial<IHubEvent> = {
    access: "private",
    allowRegistration: true,
    attendanceType: HubEventAttendanceType.InPerson,
    categories: [],
    inPersonCapacity: null,
    inPersonCapacityType: HubEventCapacityType.Unlimited,
    isAllDay: false,
    isCanceled: false,
    isDiscussable: true,
    isPlanned: true,
    isRemoved: false,
    name: "",
    notifyAttendees: true,
    onlineCapacity: null,
    onlineCapacityType: HubEventCapacityType.Unlimited,
    onlineDetails: null,
    onlineUrl: null,
    references: [],
    schemaVersion: 1,
    tags: [],
    readGroupIds: [],
    editGroupIds: [],
    view: {
      heroActions: [],
      showMap: false,
    },
    referencedContentIds: [],
    referencedContentIdsByType: [],
    location: {
      type: "none",
    },
    ...datesAndTimes,
  };

  let buildDefaultEventEntitySpy: jasmine.Spy;
  let buildDefaultEventRecordSpy: jasmine.Spy;
  let buildEventAssociationsSpy: jasmine.Spy;

  beforeEach(() => {
    buildDefaultEventEntitySpy = spyOn(
      defaultsModule,
      "buildDefaultEventEntity"
    ).and.returnValue(defaultEntity);
    buildDefaultEventRecordSpy = spyOn(
      defaultsModule,
      "buildDefaultEventRecord"
    ).and.returnValue(defaultRecord);
    buildEventAssociationsSpy = spyOn(
      buildEventAssociationsModule,
      "buildEventAssociations"
    ).and.returnValue(
      Promise.resolve([
        {
          entityId: "t36",
          entityType: "Hub Site Application",
        },
        {
          entityId: "8nd",
          entityType: "Hub Project",
        },
      ])
    );
  });

  describe("createHubEvent", () => {
    it("should create an event", async () => {
      const createdRecord = {
        ...defaultRecord,
        id: "92x",
        title: "my event",
        timeZone: "America/New_York",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        associations: [
          {
            eventId: "92x",
            entityId: "t36",
            entityType: "Hub Site Application",
          },
          {
            eventId: "92x",
            entityId: "8nd",
            entityType: "Hub Project",
          },
        ],
      };

      const createEventApiSpy = spyOn(
        eventsModule,
        "createEvent"
      ).and.returnValue(new Promise((resolve) => resolve(createdRecord)));
      const res = await createHubEvent(
        {
          name: "my event",
          timeZone: "America/New_York",
          inPersonCapacity: 50,
          inPersonCapacityType: HubEventCapacityType.Fixed,
          location: {
            type: "custom",
            spatialReference: {},
            extent: [[]],
            geometries: [],
            name: "",
          },
          referencedContentIds: ["8nd"],
          referencedContentIdsByType: [
            {
              entityId: "t36",
              entityType: "Hub Site Application",
            },
          ],
        },
        context.hubRequestOptions
      );
      expect(buildDefaultEventEntitySpy).toHaveBeenCalledTimes(1);
      expect(buildDefaultEventEntitySpy).toHaveBeenCalledWith();
      expect(buildDefaultEventRecordSpy).toHaveBeenCalledTimes(1);
      expect(buildDefaultEventRecordSpy).toHaveBeenCalledWith();
      expect(buildEventAssociationsSpy).toHaveBeenCalledTimes(1);
      expect(buildEventAssociationsSpy).toHaveBeenCalledWith(
        [
          {
            entityId: "t36",
            entityType: "Hub Site Application",
          },
        ],
        ["8nd"],
        context.hubRequestOptions
      );
      expect(createEventApiSpy).toHaveBeenCalledTimes(1);
      expect(createEventApiSpy).toHaveBeenCalledWith({
        data: {
          access: defaultRecord.access,
          allDay: defaultRecord.allDay,
          allowRegistration: defaultRecord.allowRegistration,
          attendanceType: defaultRecord.attendanceType,
          associations: [
            {
              entityId: "t36",
              entityType: "Hub Site Application",
            },
            {
              entityId: "8nd",
              entityType: "Hub Project",
            },
          ],
          categories: defaultRecord.categories,
          description: defaultRecord.description,
          editGroups: defaultRecord.editGroups,
          endDate: defaultRecord.endDate,
          endTime: defaultRecord.endTime,
          inPersonCapacity: defaultRecord.inPersonCapacity,
          notifyAttendees: defaultRecord.notifyAttendees,
          onlineMeeting: defaultRecord.onlineMeeting,
          readGroups: defaultRecord.readGroups,
          startDate: defaultRecord.startDate,
          startTime: defaultRecord.startTime,
          summary: defaultRecord.summary,
          tags: defaultRecord.tags,
          timeZone: defaultRecord.timeZone,
          title: "my event",
          location: {
            type: "custom",
            spatialReference: {},
            extent: [[]],
            geometries: [],
            placeName: "",
          },
        },
        ...context.hubRequestOptions,
      });
      expect(res.name).toEqual("my event");
    });
  });

  describe("updateHubEvent", () => {
    it("should update an event", async () => {
      const updatedRecord = {
        ...defaultRecord,
        id: "92x",
        title: "my event",
        timeZone: "America/New_York",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        associations: [
          {
            eventId: "92x",
            entityId: "t36",
            entityType: "Hub Site Application",
          },
          {
            eventId: "92x",
            entityId: "8nd",
            entityType: "Hub Project",
          },
        ] as IEventAssociation[],
      };
      const updateEventApiSpy = spyOn(
        eventsModule,
        "updateEvent"
      ).and.returnValue(new Promise((resolve) => resolve(updatedRecord)));
      const res = await updateHubEvent(
        {
          name: "my event",
          timeZone: "America/New_York",
          id: "92x",
          isCanceled: true,
          inPersonCapacity: 50,
          inPersonCapacityType: HubEventCapacityType.Fixed,
          location: {
            type: "custom",
            spatialReference: {},
            extent: [[]],
            geometries: [],
            name: "",
          },
          referencedContentIds: ["8nd"],
          referencedContentIdsByType: [
            {
              entityId: "t36",
              entityType: "Hub Site Application",
            },
          ],
        },
        context.hubRequestOptions
      );
      expect(buildDefaultEventEntitySpy).toHaveBeenCalledTimes(1);
      expect(buildDefaultEventEntitySpy).toHaveBeenCalledWith();
      expect(buildDefaultEventRecordSpy).toHaveBeenCalledTimes(1);
      expect(buildDefaultEventRecordSpy).toHaveBeenCalledWith();
      expect(buildEventAssociationsSpy).toHaveBeenCalledTimes(1);
      expect(buildEventAssociationsSpy).toHaveBeenCalledWith(
        [
          {
            entityId: "t36",
            entityType: "Hub Site Application",
          },
        ],
        ["8nd"],
        context.hubRequestOptions
      );
      expect(updateEventApiSpy).toHaveBeenCalledTimes(1);
      expect(updateEventApiSpy).toHaveBeenCalledWith({
        eventId: "92x",
        data: {
          access: defaultRecord.access,
          allDay: defaultRecord.allDay,
          allowRegistration: defaultRecord.allowRegistration,
          attendanceType: defaultRecord.attendanceType,
          associations: [
            {
              entityId: "t36",
              entityType: "Hub Site Application",
            },
            {
              entityId: "8nd",
              entityType: "Hub Project",
            },
          ],
          categories: defaultRecord.categories,
          description: defaultRecord.description,
          editGroups: defaultRecord.editGroups,
          endDate: defaultRecord.endDate,
          endTime: defaultRecord.endTime,
          inPersonCapacity: defaultRecord.inPersonCapacity,
          notifyAttendees: defaultRecord.notifyAttendees,
          onlineMeeting: defaultRecord.onlineMeeting,
          readGroups: defaultRecord.readGroups,
          startDate: defaultRecord.startDate,
          startTime: defaultRecord.startTime,
          status: EventStatus.CANCELED,
          summary: defaultRecord.summary,
          tags: defaultRecord.tags,
          timeZone: defaultRecord.timeZone,
          title: "my event",
          location: {
            type: "custom",
            spatialReference: {},
            extent: [[]],
            geometries: [],
            placeName: "",
          },
        },
        ...context.hubRequestOptions,
      });
      expect(res.name).toEqual("my event");
    });

    it("should handle empty summary and description", async () => {
      const updatedRecord = {
        ...defaultRecord,
        id: "92x",
        title: "my event",
        timeZone: "America/New_York",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        associations: [
          {
            eventId: "92x",
            entityId: "t36",
            entityType: "Hub Site Application",
          },
          {
            eventId: "92x",
            entityId: "8nd",
            entityType: "Hub Project",
          },
        ] as IEventAssociation[],
      };
      const updateEventApiSpy = spyOn(
        eventsModule,
        "updateEvent"
      ).and.returnValue(new Promise((resolve) => resolve(updatedRecord)));
      const res = await updateHubEvent(
        {
          name: "my event",
          timeZone: "America/New_York",
          id: "92x",
          isCanceled: true,
          inPersonCapacity: 50,
          inPersonCapacityType: HubEventCapacityType.Fixed,
          location: {
            type: "custom",
            spatialReference: {},
            extent: [[]],
            geometries: [],
            name: "",
          },
          referencedContentIds: ["8nd"],
          referencedContentIdsByType: [
            {
              entityId: "t36",
              entityType: "Hub Site Application",
            },
          ],
          summary: " ",
          description: " ",
        },
        context.hubRequestOptions
      );
      expect(buildDefaultEventEntitySpy).toHaveBeenCalledTimes(1);
      expect(buildDefaultEventEntitySpy).toHaveBeenCalledWith();
      expect(buildDefaultEventRecordSpy).toHaveBeenCalledTimes(1);
      expect(buildDefaultEventRecordSpy).toHaveBeenCalledWith();
      expect(buildEventAssociationsSpy).toHaveBeenCalledTimes(1);
      expect(buildEventAssociationsSpy).toHaveBeenCalledWith(
        [
          {
            entityId: "t36",
            entityType: "Hub Site Application",
          },
        ],
        ["8nd"],
        context.hubRequestOptions
      );
      expect(updateEventApiSpy).toHaveBeenCalledTimes(1);
      expect(updateEventApiSpy).toHaveBeenCalledWith({
        eventId: "92x",
        data: {
          access: defaultRecord.access,
          allDay: defaultRecord.allDay,
          allowRegistration: defaultRecord.allowRegistration,
          attendanceType: defaultRecord.attendanceType,
          associations: [
            {
              entityId: "t36",
              entityType: "Hub Site Application",
            },
            {
              entityId: "8nd",
              entityType: "Hub Project",
            },
          ],
          categories: defaultRecord.categories,
          description: defaultRecord.description,
          editGroups: defaultRecord.editGroups,
          endDate: defaultRecord.endDate,
          endTime: defaultRecord.endTime,
          inPersonCapacity: defaultRecord.inPersonCapacity,
          notifyAttendees: defaultRecord.notifyAttendees,
          onlineMeeting: defaultRecord.onlineMeeting,
          readGroups: defaultRecord.readGroups,
          startDate: defaultRecord.startDate,
          startTime: defaultRecord.startTime,
          status: EventStatus.CANCELED,
          summary: defaultRecord.summary,
          tags: defaultRecord.tags,
          timeZone: defaultRecord.timeZone,
          title: "my event",
          location: {
            type: "custom",
            spatialReference: {},
            extent: [[]],
            geometries: [],
            placeName: "",
          },
        },
        ...context.hubRequestOptions,
      });
      expect(res.name).toEqual("my event");
    });
  });

  describe("deleteHubEvent", () => {
    it("calls deleteEvent", async () => {
      const deleteEventSpy = spyOn(eventsModule, "deleteEvent").and.callFake(
        () => {
          return Promise.resolve();
        }
      );
      await deleteHubEvent("0o1", context.hubRequestOptions);
      expect(deleteEventSpy).toHaveBeenCalledWith({
        eventId: "0o1",
        ...context.hubRequestOptions,
      });
    });
  });

  describe("createHubEventRegistration", () => {
    it("calls createRegistration", async () => {
      const createRegistrationSpy = spyOn(
        registrationModule,
        "createRegistration"
      ).and.callFake(() => {
        return Promise.resolve();
      });
      const data: IHubCreateEventRegistration = {
        eventId: "0o1",
        role: registrationModule.RegistrationRole.ATTENDEE,
        type: registrationModule.EventAttendanceType.IN_PERSON,
      };
      await createHubEventRegistration(data, context.hubRequestOptions);
      expect(createRegistrationSpy).toHaveBeenCalledWith({
        data,
        ...context.hubRequestOptions,
      });
    });
  });

  describe("deleteHubEventRegistration", () => {
    it("calls deleteRegistration", async () => {
      const deleteRegistrationSpy = spyOn(
        registrationModule,
        "deleteRegistration"
      ).and.callFake(() => {
        return Promise.resolve();
      });
      await deleteHubEventRegistration("0o1", context.hubRequestOptions);
      expect(deleteRegistrationSpy).toHaveBeenCalledWith({
        registrationId: "0o1",
        ...context.hubRequestOptions,
      });
    });
  });
});
