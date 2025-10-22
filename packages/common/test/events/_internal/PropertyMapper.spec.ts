import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { IHubEvent } from "../../../src/core/types/IHubEvent";
import { EventPropertyMapper } from "../../../src/events/_internal/PropertyMapper";
import { getEventThumbnail } from "../../../src/utils/getEventThumbnail";
import { getPropertyMap } from "../../../src/events/_internal/getPropertyMap";
import {
  EventAccess,
  EventAttendanceType,
  EventLocationType,
  EventStatus,
  IEvent,
  IOnlineMeeting,
} from "../../../src/events/api/types";
import {
  HubEventAttendanceType,
  HubEventCapacityType,
} from "../../../src/events/types";
import * as getLocationFromEventModule from "../../../src/events/_internal/getLocationFromEvent";
import { IHubLocation } from "../../../src/core/types/IHubLocation";

describe("PropertyMapper", () => {
  let propertyMapper: EventPropertyMapper;
  let getLocationFromEventSpy: any;
  let locationResult: IHubLocation;

  beforeEach(() => {
    locationResult = {
      type: "none",
    };
    propertyMapper = new EventPropertyMapper(getPropertyMap());
    getLocationFromEventSpy = vi
      .spyOn(getLocationFromEventModule, "getLocationFromEvent")
      .mockReturnValue(locationResult);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("storeToEntity", () => {
    let eventRecord: IEvent;
    let start: Date;
    let end: Date;

    beforeEach(() => {
      const now = new Date();
      start = new Date(now.valueOf() + 1000 * 60 * 60);
      end = new Date(start.valueOf() + 1000 * 60 * 60);
      eventRecord = {
        access: EventAccess.PRIVATE,
        allDay: false,
        allowRegistration: false,
        attendanceType: [EventAttendanceType.IN_PERSON],
        catalog: null,
        categories: ["category1"],
        createdAt: now.toISOString(),
        createdById: "12345",
        creator: {
          agoId: "abc",
          username: "jdoe",
          email: "mockUser@gmail.com",
          firstName: "mock",
          lastName: "user",
          deleted: false,
          optedOut: false,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
        description: "event description",
        editGroups: ["editGroup1"],
        endDate: [end.getFullYear(), end.getMonth() + 1, end.getDate()].join(
          "-"
        ),
        endTime: [end.getHours(), end.getMinutes(), end.getSeconds()].join(":"),
        endDateTime: end.toISOString(),
        geometry: null,
        inPersonCapacity: 30,
        id: "31c",
        notifyAttendees: false,
        orgId: "42b",
        permission: {
          canDelete: true,
          canEdit: true,
          canSetAccessToOrg: true,
          canSetAccessToPrivate: true,
          canSetAccessToPublic: true,
          canSetStatusToCancelled: true,
          canSetStatusToRemoved: true,
        },
        readGroups: ["readGroup1"],
        recurrence: null,
        registrationCount: {
          inPerson: 0,
          virtual: 5,
        },
        startDate: [
          start.getFullYear(),
          start.getMonth() + 1,
          start.getDate(),
        ].join("-"),
        startTime: [
          start.getHours(),
          start.getMinutes(),
          start.getSeconds(),
        ].join(":"),
        startDateTime: start.toISOString(),
        status: EventStatus.PLANNED,
        summary: "event summary",
        tags: ["tag1"],
        thumbnailUrl: null,
        timeZone: "America/New_York",
        title: "event title",
        updatedAt: now.toISOString(),
        associations: [
          {
            eventId: "31c",
            entityId: "9v2",
            entityType: "Hub Site Application",
          },
        ],
      } as IEvent;
    });

    it("converts an Event record to an in-person Event entity", () => {
      eventRecord.location = {
        type: "none" as EventLocationType,
        spatialReference: {},
        extent: [[]],
        geometries: [],
      } as any;
      const res = propertyMapper.storeToEntity(eventRecord, {});
      expect(getLocationFromEventSpy).toHaveBeenCalledTimes(1);
      expect(getLocationFromEventSpy).toHaveBeenCalledWith(eventRecord);
      expect(res).toEqual({
        isAllDay: false,
        name: "event title",
        owner: "jdoe",
        canEdit: true,
        canDelete: true,
        canChangeAccessOrg: true,
        canChangeAccessPrivate: true,
        canChangeAccessPublic: true,
        catalog: {
          schemaVersion: 1,
          title: "Default Catalog",
          scopes: {
            item: {
              targetEntity: "item",
              filters: [],
            },
            event: {
              targetEntity: "event",
              filters: [],
            },
          },
          collections: [],
        },
        orgId: "42b",
        description: "event description",
        id: "31c",
        tags: ["tag1"],
        categories: ["category1"],
        timeZone: "America/New_York",
        summary: "event summary",
        notifyAttendees: false,
        allowRegistration: false,
        type: "Event",
        access: "shared",
        isCanceled: false,
        isPlanned: true,
        isRemoved: false,
        isPast: false,
        attendanceType: HubEventAttendanceType.InPerson,
        inPersonCapacity: 30,
        inPersonRegistrationCount: 0,
        inPersonCapacityType: HubEventCapacityType.Fixed,
        location: locationResult,
        onlineCapacity: null,
        onlineCapacityType: HubEventCapacityType.Unlimited,
        onlineDetails: null,
        onlineRegistrationCount: 5,
        onlineUrl: null,
        canChangeAccess: true,
        createdDate: expect.any(Date) as unknown as Date,
        startDateTime: expect.any(Date) as unknown as Date,
        startDate: expect.any(String) as unknown as string,
        endDate: expect.any(String) as unknown as string,
        startTime: expect.any(String) as unknown as string,
        endTime: expect.any(String) as unknown as string,
        endDateTime: expect.any(Date) as unknown as Date,
        createdDateSource: "createdAt",
        updatedDate: expect.any(Date) as unknown as Date,
        updatedDateSource: "updatedAt",
        canChangeStatus: true,
        canChangeStatusCancelled: true,
        canChangeStatusRemoved: true,
        readGroupIds: ["readGroup1"],
        editGroupIds: ["editGroup1"],
        links: {
          self: "/events/event-title-31c",
          siteRelative: "/events/event-title-31c",
          siteRelativeEntityType: "",
          workspaceRelative: "/workspace/events/31c",
          thumbnail: getEventThumbnail(),
        },
        slug: "event-title-31c",
        view: {
          showMap: true,
        },
        referencedContentIds: ["9v2"],
        referencedContentIdsByType: [
          {
            entityId: "9v2",
            entityType: "Hub Site Application",
          },
        ],
      });
    });

    it("converts an Event record to an online Event entity", () => {
      eventRecord.attendanceType = [EventAttendanceType.VIRTUAL];
      eventRecord.onlineMeeting = {
        capacity: 20,
        createdAt: new Date().toISOString(),
        details: "online event details",
        eventId: eventRecord.id,
        updatedAt: new Date().toISOString(),
        url: "https://somewhere.com/",
      };
      const res = propertyMapper.storeToEntity(eventRecord, {});
      expect(res.attendanceType).toEqual(HubEventAttendanceType.Online);
      expect(res.onlineCapacity).toEqual(20);
      expect(res.onlineDetails).toEqual("online event details");
      expect(res.onlineUrl).toEqual("https://somewhere.com/");
    });

    it("converts an Event record to an hybrid Event entity", () => {
      eventRecord.attendanceType = [
        EventAttendanceType.VIRTUAL,
        EventAttendanceType.IN_PERSON,
      ];
      eventRecord.onlineMeeting = {
        capacity: 20,
        createdAt: new Date().toISOString(),
        details: "online event details",
        eventId: eventRecord.id,
        updatedAt: new Date().toISOString(),
        url: "https://somewhere.com/",
      };
      eventRecord.thumbnailUrl = "https://thumbnail.jpg";
      const res = propertyMapper.storeToEntity(eventRecord, {});
      expect(res.attendanceType).toEqual(HubEventAttendanceType.Both);
    });
  });

  describe("entityToStore", () => {
    let eventEntity: IHubEvent;
    let start: Date;
    let end: Date;

    beforeEach(() => {
      const now = new Date();
      start = new Date(now.valueOf() + 1000 * 60 * 60);
      end = new Date(start.valueOf() + 1000 * 60 * 60);
      eventEntity = {
        isAllDay: false,
        name: "event title",
        owner: "jdoe",
        canEdit: true,
        canDelete: true,
        canChangeAccessOrg: true,
        canChangeAccessPrivate: true,
        canChangeAccessPublic: true,
        canChangeStatus: true,
        canChangeStatusCancelled: true,
        canChangeStatusRemoved: true,
        orgId: "42b",
        description: "event description",
        id: "31c",
        tags: ["tag1"],
        categories: ["category1"],
        summary: "event summary",
        notifyAttendees: false,
        allowRegistration: false,
        type: "Event",
        access: "private",
        isCanceled: false,
        isPlanned: true,
        isRemoved: false,
        attendanceType: HubEventAttendanceType.InPerson,
        inPersonCapacity: 30,
        inPersonCapacityType: HubEventCapacityType.Fixed,
        editGroupIds: [],
        readGroupIds: [],
        isPast: false,
        references: [],
        onlineCapacity: null,
        onlineDetails: null,
        onlineUrl: null,
        canChangeAccess: true,
        createdDate: expect.any(Date) as unknown as Date,
        startDateTime: start,
        endDateTime: end,
        createdDateSource: "createdAt",
        updatedDate: expect.any(Date) as unknown as Date,
        updatedDateSource: "updatedAt",
        startDate: [
          start.getFullYear(),
          start.getMonth() + 1,
          start.getDate(),
        ].join("-"),
        startTime: [
          start.getHours(),
          start.getMinutes(),
          start.getSeconds(),
        ].join(":"),
        endDate: [end.getFullYear(), end.getMonth() + 1, end.getDate()].join(
          "-"
        ),
        endTime: [end.getHours(), end.getMinutes(), end.getSeconds()].join(":"),
        timeZone: "America/New_York",
      } as unknown as IHubEvent;
    });

    it("converts an IHubEvent to an in-person Event record", () => {
      expect(propertyMapper.entityToStore(eventEntity, {})).toEqual({
        allDay: false,
        title: "event title",
        creator: { username: "jdoe" },
        permission: {
          canEdit: true,
          canDelete: true,
          canSetAccessToOrg: true,
          canSetAccessToPrivate: true,
          canSetAccessToPublic: true,
          canSetStatusToCancelled: true,
          canSetStatusToRemoved: true,
        },
        orgId: "42b",
        description: "event description",
        id: "31c",
        tags: ["tag1"],
        categories: ["category1"],
        timeZone: "America/New_York",
        summary: "event summary",
        notifyAttendees: false,
        allowRegistration: false,
        access: EventAccess.PRIVATE,
        status: EventStatus.PLANNED,
        attendanceType: [EventAttendanceType.IN_PERSON],
        startDate: expect.any(String) as unknown as string,
        startTime: expect.any(String) as unknown as string,
        endDate: expect.any(String) as unknown as string,
        endTime: expect.any(String) as unknown as string,
        inPersonCapacity: 30,
        location: null,
        readGroups: [],
        editGroups: [],
      } as any as IEvent);
    });

    it("converts an IHubEvent to an in-person Event record with unlimited capacity", () => {
      eventEntity.inPersonCapacityType = HubEventCapacityType.Unlimited;
      expect(propertyMapper.entityToStore(eventEntity, {})).toEqual({
        allDay: false,
        title: "event title",
        creator: { username: "jdoe" },
        permission: {
          canEdit: true,
          canDelete: true,
          canSetAccessToOrg: true,
          canSetAccessToPrivate: true,
          canSetAccessToPublic: true,
          canSetStatusToCancelled: true,
          canSetStatusToRemoved: true,
        },
        orgId: "42b",
        description: "event description",
        id: "31c",
        tags: ["tag1"],
        categories: ["category1"],
        timeZone: "America/New_York",
        summary: "event summary",
        notifyAttendees: false,
        allowRegistration: false,
        access: EventAccess.PRIVATE,
        status: EventStatus.PLANNED,
        attendanceType: [EventAttendanceType.IN_PERSON],
        startDate: expect.any(String) as unknown as string,
        startTime: expect.any(String) as unknown as string,
        endDate: expect.any(String) as unknown as string,
        endTime: expect.any(String) as unknown as string,
        inPersonCapacity: null,
        location: null,
        readGroups: [],
        editGroups: [],
      } as any as IEvent);
    });

    it("converts an IHubEvent to an all-day Event record", () => {
      eventEntity.isAllDay = true;
      expect(propertyMapper.entityToStore(eventEntity, {})).toEqual({
        allDay: true,
        title: "event title",
        creator: { username: "jdoe" },
        permission: {
          canEdit: true,
          canDelete: true,
          canSetAccessToOrg: true,
          canSetAccessToPrivate: true,
          canSetAccessToPublic: true,
          canSetStatusToCancelled: true,
          canSetStatusToRemoved: true,
        },
        orgId: "42b",
        description: "event description",
        id: "31c",
        tags: ["tag1"],
        categories: ["category1"],
        timeZone: "America/New_York",
        summary: "event summary",
        notifyAttendees: false,
        allowRegistration: false,
        access: EventAccess.PRIVATE,
        status: EventStatus.PLANNED,
        attendanceType: [EventAttendanceType.IN_PERSON],
        startDate: expect.any(String) as unknown as string,
        startTime: expect.any(String) as unknown as string,
        endDate: expect.any(String) as unknown as string,
        endTime: expect.any(String) as unknown as string,
        inPersonCapacity: 30,
        location: null,
        readGroups: [],
        editGroups: [],
      } as any as IEvent);
    });

    it("converts an IHubEvent to an online Event record", () => {
      eventEntity.attendanceType = HubEventAttendanceType.Online;
      eventEntity.onlineDetails = "online event details";
      eventEntity.onlineCapacityType = HubEventCapacityType.Fixed;
      eventEntity.onlineCapacity = 20;
      eventEntity.onlineUrl = "https://somewhere.com/";
      expect(propertyMapper.entityToStore(eventEntity, {})).toEqual({
        allDay: false,
        title: "event title",
        creator: { username: "jdoe" },
        permission: {
          canEdit: true,
          canDelete: true,
          canSetAccessToOrg: true,
          canSetAccessToPrivate: true,
          canSetAccessToPublic: true,
          canSetStatusToCancelled: true,
          canSetStatusToRemoved: true,
        },
        orgId: "42b",
        description: "event description",
        id: "31c",
        tags: ["tag1"],
        categories: ["category1"],
        timeZone: "America/New_York",
        summary: "event summary",
        notifyAttendees: false,
        allowRegistration: false,
        access: EventAccess.PRIVATE,
        status: EventStatus.PLANNED,
        attendanceType: [EventAttendanceType.VIRTUAL],
        onlineMeeting: {
          capacity: 20,
          details: "online event details",
          url: "https://somewhere.com/",
        } as IOnlineMeeting,
        startDate: expect.any(String) as unknown as string,
        startTime: expect.any(String) as unknown as string,
        endDate: expect.any(String) as unknown as string,
        endTime: expect.any(String) as unknown as string,
        inPersonCapacity: null,
        location: null,
        readGroups: [],
        editGroups: [],
      } as any as IEvent);
    });

    it("converts an IHubEvent to an online Event record with unlimited capacity", () => {
      eventEntity.onlineCapacityType = HubEventCapacityType.Unlimited;
      eventEntity.attendanceType = HubEventAttendanceType.Online;
      eventEntity.onlineDetails = "online event details";
      eventEntity.onlineCapacity = 20;
      eventEntity.onlineUrl = "https://somewhere.com/";
      expect(propertyMapper.entityToStore(eventEntity, {})).toEqual({
        allDay: false,
        title: "event title",
        creator: { username: "jdoe" },
        permission: {
          canEdit: true,
          canDelete: true,
          canSetAccessToOrg: true,
          canSetAccessToPrivate: true,
          canSetAccessToPublic: true,
          canSetStatusToCancelled: true,
          canSetStatusToRemoved: true,
        },
        orgId: "42b",
        description: "event description",
        id: "31c",
        tags: ["tag1"],
        categories: ["category1"],
        timeZone: "America/New_York",
        summary: "event summary",
        notifyAttendees: false,
        allowRegistration: false,
        access: EventAccess.PRIVATE,
        status: EventStatus.PLANNED,
        attendanceType: [EventAttendanceType.VIRTUAL],
        onlineMeeting: {
          capacity: null,
          details: "online event details",
          url: "https://somewhere.com/",
        } as IOnlineMeeting,
        startDate: expect.any(String) as unknown as string,
        startTime: expect.any(String) as unknown as string,
        endDate: expect.any(String) as unknown as string,
        endTime: expect.any(String) as unknown as string,
        inPersonCapacity: null,
        location: null,
        readGroups: [],
        editGroups: [],
      } as any as IEvent);
    });

    it("converts an IHubEvent to a hybrid Event record", () => {
      eventEntity.attendanceType = HubEventAttendanceType.Both;
      eventEntity.onlineCapacityType = HubEventCapacityType.Fixed;
      eventEntity.onlineDetails = "online event details";
      eventEntity.onlineCapacity = 20;
      eventEntity.onlineUrl = "https://somewhere.com/";
      expect(propertyMapper.entityToStore(eventEntity, {})).toEqual({
        allDay: false,
        title: "event title",
        creator: { username: "jdoe" },
        permission: {
          canEdit: true,
          canDelete: true,
          canSetAccessToOrg: true,
          canSetAccessToPrivate: true,
          canSetAccessToPublic: true,
          canSetStatusToCancelled: true,
          canSetStatusToRemoved: true,
        },
        orgId: "42b",
        description: "event description",
        id: "31c",
        tags: ["tag1"],
        categories: ["category1"],
        timeZone: "America/New_York",
        summary: "event summary",
        notifyAttendees: false,
        allowRegistration: false,
        access: EventAccess.PRIVATE,
        status: EventStatus.PLANNED,
        attendanceType: [
          EventAttendanceType.IN_PERSON,
          EventAttendanceType.VIRTUAL,
        ],
        onlineMeeting: {
          capacity: 20,
          details: "online event details",
          url: "https://somewhere.com/",
        } as IOnlineMeeting,
        startDate: expect.any(String) as unknown as string,
        startTime: expect.any(String) as unknown as string,
        endDate: expect.any(String) as unknown as string,
        endTime: expect.any(String) as unknown as string,
        inPersonCapacity: 30,
        location: null,
        readGroups: [],
        editGroups: [],
      } as any as IEvent);
    });

    it("converts an IHubEvent to a cancelled Event record", () => {
      eventEntity.isCanceled = true;
      expect(propertyMapper.entityToStore(eventEntity, {})).toEqual({
        allDay: false,
        title: "event title",
        creator: { username: "jdoe" },
        permission: {
          canEdit: true,
          canDelete: true,
          canSetAccessToOrg: true,
          canSetAccessToPrivate: true,
          canSetAccessToPublic: true,
          canSetStatusToCancelled: true,
          canSetStatusToRemoved: true,
        },
        orgId: "42b",
        description: "event description",
        id: "31c",
        tags: ["tag1"],
        categories: ["category1"],
        timeZone: "America/New_York",
        summary: "event summary",
        notifyAttendees: false,
        allowRegistration: false,
        access: EventAccess.PRIVATE,
        status: EventStatus.CANCELED,
        attendanceType: [EventAttendanceType.IN_PERSON],
        startDate: expect.any(String) as unknown as string,
        startTime: expect.any(String) as unknown as string,
        endDate: expect.any(String) as unknown as string,
        endTime: expect.any(String) as unknown as string,
        inPersonCapacity: 30,
        location: null,
        readGroups: [],
        editGroups: [],
      } as any as IEvent);
    });

    it("converts an IHubEvent to a removed Event record", () => {
      eventEntity.isRemoved = true;
      expect(propertyMapper.entityToStore(eventEntity, {})).toEqual({
        allDay: false,
        title: "event title",
        creator: { username: "jdoe" },
        permission: {
          canEdit: true,
          canDelete: true,
          canSetAccessToOrg: true,
          canSetAccessToPrivate: true,
          canSetAccessToPublic: true,
          canSetStatusToCancelled: true,
          canSetStatusToRemoved: true,
        },
        orgId: "42b",
        description: "event description",
        id: "31c",
        tags: ["tag1"],
        categories: ["category1"],
        timeZone: "America/New_York",
        summary: "event summary",
        notifyAttendees: false,
        allowRegistration: false,
        access: EventAccess.PRIVATE,
        status: EventStatus.REMOVED,
        attendanceType: [EventAttendanceType.IN_PERSON],
        startDate: expect.any(String) as unknown as string,
        startTime: expect.any(String) as unknown as string,
        endDate: expect.any(String) as unknown as string,
        endTime: expect.any(String) as unknown as string,
        inPersonCapacity: 30,
        location: null,
        readGroups: [],
        editGroups: [],
      } as any as IEvent);
    });

    it("converts a shared IHubEvent to a private Event record", () => {
      eventEntity.access = "shared";
      expect(propertyMapper.entityToStore(eventEntity, {})).toEqual({
        allDay: false,
        title: "event title",
        creator: { username: "jdoe" },
        permission: {
          canEdit: true,
          canDelete: true,
          canSetAccessToOrg: true,
          canSetAccessToPrivate: true,
          canSetAccessToPublic: true,
          canSetStatusToCancelled: true,
          canSetStatusToRemoved: true,
        },
        orgId: "42b",
        description: "event description",
        id: "31c",
        tags: ["tag1"],
        categories: ["category1"],
        timeZone: "America/New_York",
        summary: "event summary",
        notifyAttendees: false,
        allowRegistration: false,
        access: EventAccess.PRIVATE,
        status: EventStatus.PLANNED,
        attendanceType: [EventAttendanceType.IN_PERSON],
        startDate: expect.any(String) as unknown as string,
        startTime: expect.any(String) as unknown as string,
        endDate: expect.any(String) as unknown as string,
        endTime: expect.any(String) as unknown as string,
        inPersonCapacity: 30,
        location: null,
        readGroups: [],
        editGroups: [],
      } as any as IEvent);
    });
  });
});
