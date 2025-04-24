import { buildSchema } from "../../../src/events/_internal/EventSchemaCreate";
import { IConfigurationSchema } from "../../../src/core/schemas/types";
import * as getDefaultEventDatesAndTimesModule from "../../../src/events/_internal/getDefaultEventDatesAndTimes";
import { ENTITY_NAME_SCHEMA } from "../../../src/core/schemas/shared/subschemas";
import { HubEventAttendanceType } from "../../../src/events/types";
import {
  TIME_VALIDATIONS_WHEN_NOT_ALL_DAY,
  URL_VALIDATIONS_WHEN_ONLINE_OR_HYBRID,
} from "../../../src/events/_internal/validations";

describe("EventSchemaCreate", () => {
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
        $async: true,
        required: ["name", "startDate", "endDate"],
        properties: {
          name: ENTITY_NAME_SCHEMA,
          startDate: {
            type: "string",
            format: "date",
            formatMinimum: datesAndTimes.startDate,
          },
          startTime: {
            type: "string",
          },
          endTime: {
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
          isAllDay: {
            type: "boolean",
            default: false,
          },
          onlineUrl: {
            type: "string",
          },
        },
        allOf: [
          URL_VALIDATIONS_WHEN_ONLINE_OR_HYBRID,
          TIME_VALIDATIONS_WHEN_NOT_ALL_DAY,
        ],
      } as IConfigurationSchema);
    });
  });
});
