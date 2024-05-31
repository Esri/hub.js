import * as getDefaultEventDatesAndTimesModule from "../../src/events/_internal/getDefaultEventDatesAndTimes";
import {
  EventAccess,
  EventAttendanceType,
  EventStatus,
} from "../../src/events/api/types";
import {
  buildDefaultEventEntity,
  buildDefaultEventRecord,
} from "../../src/events/defaults";
import { HubEventAttendanceType } from "../../src/events/types";

describe("HubEvent defaults:", () => {
  describe("buildDefaultEventEntity", () => {
    it("should return a default event entity", () => {
      const datesAndTimes = {
        startDate: "2024-03-31",
        startDateTime: new Date(),
        startTime: "12:00:00",
        endDate: "2024-03-31",
        endDateTime: new Date(),
        endTime: "14:00:00",
        timeZone: "America/Philadelphia",
      };
      const getDefaultEventDatesAndTimesSpy = spyOn(
        getDefaultEventDatesAndTimesModule,
        "getDefaultEventDatesAndTimes"
      ).and.returnValue(datesAndTimes);
      expect(buildDefaultEventEntity()).toEqual({
        access: "private",
        allowRegistration: true,
        attendanceType: HubEventAttendanceType.InPerson,
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
        references: [],
        schemaVersion: 1,
        tags: [],
        readGroupIds: [],
        editGroupIds: [],
        view: {
          heroActions: [],
        },
        ...datesAndTimes,
      });
      expect(getDefaultEventDatesAndTimesSpy).toHaveBeenCalledTimes(1);
    });
  });
  describe("buildDefaultEventRecord", () => {
    it("should return a default event record", () => {
      const datesAndTimes = {
        startDate: "2024-03-31",
        startDateTime: new Date(),
        startTime: "12:00:00",
        endDate: "2024-03-31",
        endDateTime: new Date(),
        endTime: "14:00:00",
        timeZone: "America/Philadelphia",
      };
      const getDefaultEventDatesAndTimesSpy = spyOn(
        getDefaultEventDatesAndTimesModule,
        "getDefaultEventDatesAndTimes"
      ).and.returnValue(datesAndTimes);
      expect(buildDefaultEventRecord()).toEqual({
        access: EventAccess.PRIVATE,
        allDay: false,
        allowRegistration: true,
        attendanceType: [EventAttendanceType.IN_PERSON],
        categories: [],
        inPersonCapacity: null,
        editGroups: [],
        endDateTime: jasmine.any(String) as unknown as string,
        notifyAttendees: true,
        readGroups: [],
        startDateTime: jasmine.any(String) as unknown as string,
        status: EventStatus.PLANNED,
        tags: [],
        title: "",
      });
      expect(getDefaultEventDatesAndTimesSpy).toHaveBeenCalledTimes(1);
    });
  });
});
