import * as PortalModule from "@esri/arcgis-rest-portal";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as eventModule from "../../src/events/api/events";
import {
  EventAccess,
  EventAttendanceType,
  EventStatus,
  IEvent,
} from "../../src/events/api/types";
import { fetchEvent } from "../../src/events/fetch";

describe("HubEvent fetch module:", () => {
  describe("fetchEvent", () => {
    it("should fetch the event by id", async () => {
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
      const event = {
        id: "123",
        access: EventAccess.PRIVATE,
        allDay: false,
        allowRegistration: true,
        attendanceType: [EventAttendanceType.IN_PERSON],
        associations: [],
        categories: [],
        editGroups: [],
        endDateTime: new Date().toISOString(),
        notifyAttendees: true,
        readGroups: [],
        registrationCount: {
          inPerson: 0,
          virtual: 5,
        },
        startDateTime: new Date().toISOString(),
        status: EventStatus.PLANNED,
        tags: [],
        title: "my event",
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
      } as unknown as IEvent;
      const getEventSpy = vi
        .spyOn(eventModule, "getEvent")
        .mockReturnValue(new Promise((resolve) => resolve(event)));
      const res = await fetchEvent(
        "123",
        authdCtxMgr.context.hubRequestOptions
      );
      expect(getEventSpy).toHaveBeenCalledTimes(1);
      expect(getEventSpy).toHaveBeenCalledWith({
        eventId: "123",
        data: {
          include: "associations",
        },
        ...authdCtxMgr.context.hubRequestOptions,
      });
      expect(res.name).toEqual("my event");
    });
    it("should fetch the event by slug", async () => {
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
      const event = {
        id: "123",
        access: EventAccess.PRIVATE,
        allDay: false,
        allowRegistration: true,
        associations: [],
        attendanceType: [EventAttendanceType.IN_PERSON],
        categories: [],
        editGroups: [],
        endDateTime: new Date().toISOString(),
        notifyAttendees: true,
        readGroups: [],
        registrationCount: {
          inPerson: 0,
          virtual: 5,
        },
        startDateTime: new Date().toISOString(),
        status: EventStatus.PLANNED,
        tags: [],
        title: "my event",
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
      } as unknown as IEvent;
      const getEventSpy = vi
        .spyOn(eventModule, "getEvent")
        .mockReturnValue(new Promise((resolve) => resolve(event)));
      const res = await fetchEvent(
        "my-event-123",
        authdCtxMgr.context.hubRequestOptions
      );
      expect(getEventSpy).toHaveBeenCalledTimes(1);
      expect(getEventSpy).toHaveBeenCalledWith({
        eventId: "123",
        data: {
          include: "associations",
        },
        ...authdCtxMgr.context.hubRequestOptions,
      });
      expect(res.name).toEqual("my event");
    });
    it("should throw when an error occurs", async () => {
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
      vi.spyOn(eventModule, "getEvent").mockReturnValue(
        new Promise((resolve, reject) => reject(new Error("fail")))
      );
      try {
        await fetchEvent("123", authdCtxMgr.context.hubRequestOptions);
        fail("did not reject");
      } catch (e) {
        const error = e as { message?: string };
        expect(error.message).toEqual("Failed to fetch event.");
      }
    });
  });
});
