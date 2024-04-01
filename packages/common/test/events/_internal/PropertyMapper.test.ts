import * as propertyMapperModule from "../../../src/core/_internal/PropertyMapper";
import { IHubEvent } from "../../../src/core/types/IHubEvent";
import { PropertyMapper } from "../../../src/events/_internal/PropertyMapper";
import { getPropertyMap } from "../../../src/events/_internal/getPropertyMap";
import { IOnlineMeeting } from "../../../src/events/api/orval/api/orval-events";
import {
  EventAccess,
  EventAttendanceType,
  EventStatus,
  IEvent,
} from "../../../src/events/api/types";

describe("PropertyMapper", () => {
  let propertyMapper: PropertyMapper;

  beforeEach(() => {
    propertyMapper = new PropertyMapper(getPropertyMap());
  });

  describe("storeToEntity", () => {
    let eventRecord: IEvent;

    beforeEach(() => {
      eventRecord = {
        access: EventAccess.PRIVATE,
        addresses: [
          {
            address: "1600 Pennsylvania Ave NW, Washington, DC 20500",
            address2: "Suite 200",
            capacity: 30,
            createdAt: new Date().toISOString(),
            description: "in-person description",
            eventId: "31c",
            extent: {},
            geoAddress: "1600 Pennsylvania Ave NW, Washington, DC 20500",
            geoAddrType: "something",
            geoScore: 95,
            location: {},
            updatedAt: new Date().toISOString(),
            venue: "The White House",
          },
        ],
        allDay: false,
        allowRegistration: false,
        attendanceType: [EventAttendanceType.IN_PERSON],
        catalog: null,
        categories: ["category1"],
        createdAt: new Date().toISOString(),
        createdById: "jdoe",
        description: "event description",
        editGroups: ["editGroup1"],
        endDateTime: new Date().toISOString(),
        geometry: null,
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
        startDateTime: new Date().toISOString(),
        status: EventStatus.PLANNED,
        summary: "event summary",
        tags: ["tag1"],
        timeZone: "America/New_York",
        title: "event title",
        updatedAt: new Date().toISOString(),
      };
    });

    it("converts an Event record to an in-person Event entity", () => {
      const res = propertyMapper.storeToEntity(eventRecord, {});
      expect(res).toEqual({
        isAllDay: false,
        name: "event title",
        owner: "jdoe",
        canEdit: true,
        canDelete: true,
        canChangeAccessOrg: true,
        canChangeAccessPrivate: true,
        canChangeAccessPublic: true,
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
        access: "private",
        isCanceled: false,
        isPlanned: true,
        isRemoved: false,
        attendanceType: "inPerson",
        inPersonCapacity: 30,
        onlineCapacity: null,
        onlineDetails: null,
        onlineUrl: null,
        canChangeAccess: true,
        createdDate: jasmine.any(Date) as unknown as Date,
        startDateTime: jasmine.any(Date) as unknown as Date,
        startDate: jasmine.any(String) as unknown as string,
        endDate: jasmine.any(String) as unknown as string,
        startTime: jasmine.any(String) as unknown as string,
        endTime: jasmine.any(String) as unknown as string,
        endDateTime: jasmine.any(Date) as unknown as Date,
        createdDateSource: "createdAt",
        updatedDate: jasmine.any(Date) as unknown as Date,
        updatedDateSource: "updatedAt",
        canChangeStatus: true,
        canChangeStatusCancelled: true,
        canChangeStatusRemoved: true,
      });
    });

    it("converts an Event record to an online Event entity", () => {
      eventRecord.attendanceType = [EventAttendanceType.VIRTUAL];
      eventRecord.onlineMeetings = [
        {
          capacity: 20,
          createdAt: new Date().toISOString(),
          details: "online event details",
          eventId: eventRecord.id,
          updatedAt: new Date().toISOString(),
          url: "https://somewhere.com/",
        },
      ];
      delete eventRecord.addresses;
      const res = propertyMapper.storeToEntity(eventRecord, {});
      expect(res.attendanceType).toEqual("online");
      expect(res.onlineCapacity).toEqual(20);
      expect(res.onlineDetails).toEqual("online event details");
      expect(res.onlineUrl).toEqual("https://somewhere.com/");
    });

    it("converts an Event record to an hybrid Event entity", () => {
      eventRecord.attendanceType = [
        EventAttendanceType.VIRTUAL,
        EventAttendanceType.IN_PERSON,
      ];
      eventRecord.onlineMeetings = [
        {
          capacity: 20,
          createdAt: new Date().toISOString(),
          details: "online event details",
          eventId: eventRecord.id,
          updatedAt: new Date().toISOString(),
          url: "https://somewhere.com/",
        },
      ];
      const res = propertyMapper.storeToEntity(eventRecord, {});
      expect(res.attendanceType).toEqual("both");
    });
  });

  describe("entityToStore", () => {
    let eventEntity: IHubEvent;

    beforeEach(() => {
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
        attendanceType: "inPerson",
        inPersonCapacity: 30,
        onlineCapacity: null,
        onlineDetails: null,
        onlineUrl: null,
        canChangeAccess: true,
        createdDate: jasmine.any(Date) as unknown as Date,
        startDateTime: jasmine.any(Date) as unknown as Date,
        endDateTime: jasmine.any(Date) as unknown as Date,
        createdDateSource: "createdAt",
        updatedDate: jasmine.any(Date) as unknown as Date,
        updatedDateSource: "updatedAt",
        startDate: "2024-04-1",
        endDate: "2024-04-01",
        startTime: "12:00:00",
        endTime: "01:00:00",
        timeZone: "America/New_York",
      } as IHubEvent;
    });

    it("converts an IHubEvent to an in-person Event record", () => {
      expect(propertyMapper.entityToStore(eventEntity, {})).toEqual({
        allDay: false,
        title: "event title",
        createdById: "jdoe",
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
        startDateTime: jasmine.any(String) as unknown as string,
        endDateTime: jasmine.any(String) as unknown as string,
      });
    });

    it("converts an IHubEvent to an online Event record", () => {
      eventEntity.attendanceType = "online";
      eventEntity.onlineDetails = "online event details";
      eventEntity.onlineCapacity = 20;
      eventEntity.onlineUrl = "https://somewhere.com/";
      expect(propertyMapper.entityToStore(eventEntity, {})).toEqual({
        allDay: false,
        title: "event title",
        createdById: "jdoe",
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
        onlineMeetings: [
          {
            capacity: 20,
            details: "online event details",
            url: "https://somewhere.com/",
          } as IOnlineMeeting,
        ],
        startDateTime: jasmine.any(String) as unknown as string,
        endDateTime: jasmine.any(String) as unknown as string,
      });
    });

    it("converts an IHubEvent to a hybrid Event record", () => {
      eventEntity.attendanceType = "both";
      eventEntity.onlineDetails = "online event details";
      eventEntity.onlineCapacity = 20;
      eventEntity.onlineUrl = "https://somewhere.com/";
      expect(propertyMapper.entityToStore(eventEntity, {})).toEqual({
        allDay: false,
        title: "event title",
        createdById: "jdoe",
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
        onlineMeetings: [
          {
            capacity: 20,
            details: "online event details",
            url: "https://somewhere.com/",
          } as IOnlineMeeting,
        ],
        startDateTime: jasmine.any(String) as unknown as string,
        endDateTime: jasmine.any(String) as unknown as string,
      });
    });

    it("converts an IHubEvent to a cancelled Event record", () => {
      eventEntity.isCanceled = true;
      expect(propertyMapper.entityToStore(eventEntity, {})).toEqual({
        allDay: false,
        title: "event title",
        createdById: "jdoe",
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
        startDateTime: jasmine.any(String) as unknown as string,
        endDateTime: jasmine.any(String) as unknown as string,
      });
    });

    it("converts an IHubEvent to a removed Event record", () => {
      eventEntity.isRemoved = true;
      expect(propertyMapper.entityToStore(eventEntity, {})).toEqual({
        allDay: false,
        title: "event title",
        createdById: "jdoe",
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
        startDateTime: jasmine.any(String) as unknown as string,
        endDateTime: jasmine.any(String) as unknown as string,
      });
    });
  });
});
