import * as PortalModule from "@esri/arcgis-rest-portal";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as defaultsModule from "../../src/events/defaults";
import * as eventsModule from "../../src/events/api/events";
import {
  EventAccess,
  EventAttendanceType,
  EventStatus,
  IEvent,
} from "../../src/events/api/types";
import { createHubEvent, updateHubEvent } from "../../src/events/edit";
import { IHubEvent } from "../../src/core/types/IHubEvent";

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
        attendanceType: "inPerson",
        categories: [],
        inPersonCapacity: null,
        isAllDay: false,
        isCanceled: false,
        isDiscussable: true,
        isPlanned: true,
        isRemoved: false,
        name: "",
        notifyAttendees: true,
        onlineCapacity: null,
        onlineDetails: null,
        onlineUrl: null,
        permissions: [],
        references: [],
        schemaVersion: 1,
        tags: [],
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
        notifyAttendees: true,
        readGroups: [],
        startDateTime: datesAndTimes.startDateTime.toISOString(),
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
        { name: "my event", timeZone: "America/New_York" },
        authdCtxMgr.context.hubRequestOptions
      );
      expect(buildDefaultEventEntitySpy).toHaveBeenCalledTimes(1);
      expect(buildDefaultEventRecordSpy).toHaveBeenCalledTimes(1);
      expect(createEventApiSpy).toHaveBeenCalledTimes(1);
      expect(createEventApiSpy).toHaveBeenCalledWith({
        data: {
          access: defaultRecord.access,
          addresses: defaultRecord.addresses,
          allDay: defaultRecord.allDay,
          allowRegistration: defaultRecord.allowRegistration,
          attendanceType: defaultRecord.attendanceType,
          categories: defaultRecord.categories,
          description: defaultRecord.description,
          editGroups: defaultRecord.editGroups,
          endDateTime: jasmine.any(String) as unknown as string,
          notifyAttendees: defaultRecord.notifyAttendees,
          onlineMeetings: defaultRecord.onlineMeetings,
          readGroups: defaultRecord.readGroups,
          startDateTime: jasmine.any(String) as unknown as string,
          summary: defaultRecord.summary,
          tags: defaultRecord.tags,
          timeZone: defaultRecord.timeZone,
          title: "my event",
        },
        ...authdCtxMgr.context.hubRequestOptions,
      });
      expect(res.name).toEqual("my event");
    });
    it("should create an all-day event", async () => {
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
        attendanceType: "inPerson",
        categories: [],
        inPersonCapacity: null,
        isAllDay: false,
        isCanceled: false,
        isDiscussable: true,
        isPlanned: true,
        isRemoved: false,
        name: "",
        notifyAttendees: true,
        onlineCapacity: null,
        onlineDetails: null,
        onlineUrl: null,
        permissions: [],
        references: [],
        schemaVersion: 1,
        tags: [],
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
        notifyAttendees: true,
        readGroups: [],
        startDateTime: datesAndTimes.startDateTime.toISOString(),
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
        allDay: true,
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
        { name: "my event", timeZone: "America/New_York", isAllDay: true },
        authdCtxMgr.context.hubRequestOptions
      );
      expect(buildDefaultEventEntitySpy).toHaveBeenCalledTimes(1);
      expect(buildDefaultEventRecordSpy).toHaveBeenCalledTimes(1);
      expect(createEventApiSpy).toHaveBeenCalledTimes(1);
      expect(createEventApiSpy).toHaveBeenCalledWith({
        data: {
          access: defaultRecord.access,
          addresses: defaultRecord.addresses,
          allDay: true,
          allowRegistration: defaultRecord.allowRegistration,
          attendanceType: defaultRecord.attendanceType,
          categories: defaultRecord.categories,
          description: defaultRecord.description,
          editGroups: defaultRecord.editGroups,
          endDateTime: jasmine.any(String) as unknown as string,
          notifyAttendees: defaultRecord.notifyAttendees,
          onlineMeetings: defaultRecord.onlineMeetings,
          readGroups: defaultRecord.readGroups,
          startDateTime: jasmine.any(String) as unknown as string,
          summary: defaultRecord.summary,
          tags: defaultRecord.tags,
          timeZone: defaultRecord.timeZone,
          title: "my event",
        },
        ...authdCtxMgr.context.hubRequestOptions,
      });
      expect(res.name).toEqual("my event");
    });
  });

  describe("updateHubEvent", () => {
    it("should reject for now", async () => {
      const event = {
        access: EventAccess.PRIVATE,
        allDay: false,
        allowRegistration: true,
        attendanceType: [EventAttendanceType.IN_PERSON],
        categories: [],
        editGroups: [],
        endDateTime: new Date().toISOString(),
        notifyAttendees: true,
        readGroups: [],
        startDateTime: new Date().toISOString(),
        status: EventStatus.PLANNED,
        tags: [],
        title: "",
      } as unknown as IHubEvent;
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
      try {
        await updateHubEvent(event, authdCtxMgr.context.hubRequestOptions);
        fail("not rejected");
      } catch (e) {
        expect(e.message).toBe("not implemented");
      }
    });
  });
});
