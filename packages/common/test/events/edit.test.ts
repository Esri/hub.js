import * as PortalModule from "@esri/arcgis-rest-portal";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as defaultsModule from "../../src/events/defaults";
import * as eventsModule from "../../src/events/api/events";
import * as registrationModule from "../../src/events/api";
import {
  EventAccess,
  EventAttendanceType,
  EventStatus,
  IEvent,
} from "../../src/events/api/types";
import {
  createHubEvent,
  createHubEventRegistration,
  deleteHubEventRegistration,
  IHubCreateEventRegistration,
  updateHubEvent,
} from "../../src/events/edit";
import { IHubEvent } from "../../src/core/types/IHubEvent";
import {
  HubEventAttendanceType,
  HubEventCapacityType,
} from "../../src/events/types";

describe("HubEvents edit module", () => {
  describe("createHubEvent", () => {
    it("should create an event", async () => {
      const authdCtxMgr = await ArcGISContextManager.create({
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
      });
      const datesAndTimes = {
        startDate: "2024-03-31",
        startDateTime: new Date(),
        startTime: "12:00:00",
        endDate: "2024-03-31",
        endDateTime: new Date(),
        endTime: "14:00:00",
        timeZone: "America/New_York",
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
        location: {
          type: "none",
        },
        ...datesAndTimes,
      };
      const defaultRecord: Partial<IEvent> = {
        access: EventAccess.PRIVATE,
        allDay: false,
        allowRegistration: true,
        attendanceType: [EventAttendanceType.IN_PERSON],
        categories: [],
        editGroups: [],
        endDateTime: datesAndTimes.endDateTime.toISOString(),
        endDate: datesAndTimes.endDate,
        endTime: datesAndTimes.endTime,
        inPersonCapacity: 50,
        notifyAttendees: true,
        readGroups: [],
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
      };
      const createdRecord = {
        ...defaultRecord,
        title: "my event",
        timeZone: "America/New_York",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const buildDefaultEventEntitySpy = spyOn(
        defaultsModule,
        "buildDefaultEventEntity"
      ).and.returnValue(defaultEntity);
      const buildDefaultEventRecordSpy = spyOn(
        defaultsModule,
        "buildDefaultEventRecord"
      ).and.returnValue(defaultRecord);
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
          },
        },
        authdCtxMgr.context.hubRequestOptions
      );
      expect(buildDefaultEventEntitySpy).toHaveBeenCalledTimes(1);
      expect(buildDefaultEventRecordSpy).toHaveBeenCalledTimes(1);
      expect(createEventApiSpy).toHaveBeenCalledTimes(1);
      expect(createEventApiSpy).toHaveBeenCalledWith({
        data: {
          access: defaultRecord.access,
          allDay: defaultRecord.allDay,
          allowRegistration: defaultRecord.allowRegistration,
          attendanceType: defaultRecord.attendanceType,
          categories: defaultRecord.categories,
          description: defaultRecord.description,
          editGroups: defaultRecord.editGroups,
          // endDateTime not included
          endDate: defaultRecord.endDate,
          endTime: defaultRecord.endTime,
          inPersonCapacity: defaultRecord.inPersonCapacity,
          notifyAttendees: defaultRecord.notifyAttendees,
          onlineMeetings: defaultRecord.onlineMeetings,
          readGroups: defaultRecord.readGroups,
          // startDateTime not included
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
          },
        },
        ...authdCtxMgr.context.hubRequestOptions,
      });
      expect(res.name).toEqual("my event");
    });
  });

  describe("updateHubEvent", () => {
    it("should update an event", async () => {
      const authdCtxMgr = await ArcGISContextManager.create({
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
      });
      const datesAndTimes = {
        startDate: "2024-03-31",
        startDateTime: new Date(),
        startTime: "12:00:00",
        endDate: "2024-03-31",
        endDateTime: new Date(),
        endTime: "14:00:00",
        timeZone: "America/New_York",
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
        location: {
          type: "none",
        },
        ...datesAndTimes,
      };
      const defaultRecord: Partial<IEvent> = {
        access: EventAccess.PRIVATE,
        allDay: false,
        allowRegistration: true,
        attendanceType: [EventAttendanceType.IN_PERSON],
        categories: [],
        editGroups: [],
        endDateTime: datesAndTimes.endDateTime.toISOString(),
        endDate: datesAndTimes.endDate,
        endTime: datesAndTimes.endTime,
        inPersonCapacity: 50,
        notifyAttendees: true,
        readGroups: [],
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
      };
      const updatedRecord = {
        ...defaultRecord,
        title: "my event",
        timeZone: "America/New_York",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const buildDefaultEventEntitySpy = spyOn(
        defaultsModule,
        "buildDefaultEventEntity"
      ).and.returnValue(defaultEntity);
      const buildDefaultEventRecordSpy = spyOn(
        defaultsModule,
        "buildDefaultEventRecord"
      ).and.returnValue(defaultRecord);
      const updateEventApiSpy = spyOn(
        eventsModule,
        "updateEvent"
      ).and.returnValue(new Promise((resolve) => resolve(updatedRecord)));
      const res = await updateHubEvent(
        {
          name: "my event",
          timeZone: "America/New_York",
          id: "31c",
          isCanceled: true,
          inPersonCapacity: 50,
          inPersonCapacityType: HubEventCapacityType.Fixed,
          location: {
            type: "custom",
            spatialReference: {},
            extent: [[]],
            geometries: [],
          },
        },
        authdCtxMgr.context.hubRequestOptions
      );
      expect(buildDefaultEventEntitySpy).toHaveBeenCalledTimes(1);
      expect(buildDefaultEventRecordSpy).toHaveBeenCalledTimes(1);
      expect(updateEventApiSpy).toHaveBeenCalledTimes(1);
      expect(updateEventApiSpy).toHaveBeenCalledWith({
        eventId: "31c",
        data: {
          access: defaultRecord.access,
          allDay: defaultRecord.allDay,
          allowRegistration: defaultRecord.allowRegistration,
          attendanceType: defaultRecord.attendanceType,
          categories: defaultRecord.categories,
          description: defaultRecord.description,
          editGroups: defaultRecord.editGroups,
          // endDateTime not included
          endDate: defaultRecord.endDate,
          endTime: defaultRecord.endTime,
          inPersonCapacity: defaultRecord.inPersonCapacity,
          notifyAttendees: defaultRecord.notifyAttendees,
          onlineMeetings: defaultRecord.onlineMeetings,
          readGroups: defaultRecord.readGroups,
          // startDateTime not included
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
          },
        },
        ...authdCtxMgr.context.hubRequestOptions,
      });
      expect(res.name).toEqual("my event");
    });
  });

  describe("createHubEventRegistration", () => {
    it("calls createRegistration", async () => {
      const authdCtxMgr = await ArcGISContextManager.create({
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
      });
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
      await createHubEventRegistration(
        data,
        authdCtxMgr.context.hubRequestOptions
      );
      expect(createRegistrationSpy).toHaveBeenCalledWith({
        data,
        ...authdCtxMgr.context.hubRequestOptions,
      });
    });
  });

  describe("deleteHubEventRegistration", () => {
    it("calls deleteRegistration", async () => {
      const authdCtxMgr = await ArcGISContextManager.create({
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
      });
      const deleteRegistrationSpy = spyOn(
        registrationModule,
        "deleteRegistration"
      ).and.callFake(() => {
        return Promise.resolve();
      });
      await deleteHubEventRegistration(
        "0o1",
        authdCtxMgr.context.hubRequestOptions
      );
      expect(deleteRegistrationSpy).toHaveBeenCalledWith({
        registrationId: "0o1",
        ...authdCtxMgr.context.hubRequestOptions,
      });
    });
  });
});
