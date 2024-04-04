import { buildSchema } from "../../../src/events/_internal/EventSchemaEdit";
import { IConfigurationSchema } from "../../../src/core/schemas/types";
import * as getDefaultEventDatesAndTimesModule from "../../../src/events/_internal/getDefaultEventDatesAndTimes";
import {
  ENTITY_CATEGORIES_SCHEMA,
  ENTITY_NAME_SCHEMA,
  ENTITY_SUMMARY_SCHEMA,
  ENTITY_TAGS_SCHEMA,
} from "../../../src/core/schemas/shared/subschemas";
import {
  HubEventAttendanceType,
  HubEventOnlineCapacityType,
} from "../../../src/events/types";
import {
  FIXED_ONLINE_ATTENDANCE_VALIDATIONS,
  TIME_VALIDATIONS_WHEN_NOT_ALL_DAY,
  URL_VALIDATIONS_WHEN_ONLINE_OR_HYBRID,
} from "../../../src/events/_internal/validations";

describe("EventSchemaEdit", () => {
  describe("buildSchema", () => {
    it("should return the expected ui schema", async () => {
      const datesAndTimes = {
        startDate: "2024-03-31",
        startDateTime: new Date(),
        startTime: "12:00:00",
        endDate: "2024-03-31",
        endDateTime: new Date(),
        endTime: "14:00:00",
        timeZone: "America/New_York",
      };
      const getDefaultEventDatesAndTimesSpy = spyOn(
        getDefaultEventDatesAndTimesModule,
        "getDefaultEventDatesAndTimes"
      ).and.returnValue(datesAndTimes);
      const res = buildSchema();
      expect(getDefaultEventDatesAndTimesSpy).toHaveBeenCalledTimes(1);
      expect(res).toEqual({
        required: ["name", "description", "startDate", "endDate"],
        properties: {
          name: ENTITY_NAME_SCHEMA,
          description: {
            type: "string",
          },
          attendanceType: {
            type: "string",
            enum: [
              HubEventAttendanceType.InPerson,
              HubEventAttendanceType.Online,
              HubEventAttendanceType.Both,
            ],
            default: HubEventAttendanceType.InPerson,
          },
          startDate: {
            type: "string",
            format: "date",
            formatMinimum: datesAndTimes.startDate,
          },
          endDate: {
            type: "string",
            format: "date",
            formatMinimum: {
              $data: "1/startDate",
            },
          },
          startTime: {
            type: "string",
          },
          endTime: {
            type: "string",
          },
          isAllDay: {
            type: "boolean",
            default: false,
          },
          onlineUrl: {
            type: "string",
          },
          onlineDetails: {
            type: "string",
          },
          onlineCapacity: {
            type: "number",
          },
          onlineCapacityType: {
            type: "string",
            enum: [
              HubEventOnlineCapacityType.Unlimited,
              HubEventOnlineCapacityType.Fixed,
            ],
            default: HubEventOnlineCapacityType.Unlimited,
          },
          summary: ENTITY_SUMMARY_SCHEMA,
          tags: ENTITY_TAGS_SCHEMA,
          categories: ENTITY_CATEGORIES_SCHEMA,
        },
        allOf: [
          URL_VALIDATIONS_WHEN_ONLINE_OR_HYBRID,
          TIME_VALIDATIONS_WHEN_NOT_ALL_DAY,
          FIXED_ONLINE_ATTENDANCE_VALIDATIONS,
        ],
      } as IConfigurationSchema);
    });
  });
});
