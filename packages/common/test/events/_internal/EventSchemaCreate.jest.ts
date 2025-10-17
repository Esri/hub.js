import { buildSchema } from "../../../src/events/_internal/EventSchemaCreate";
import { IConfigurationSchema } from "../../../src/core/schemas/types";
import * as getDefaultEventDatesAndTimesModule from "../../../src/events/_internal/getDefaultEventDatesAndTimes";
import { ENTITY_NAME_SCHEMA } from "../../../src/core/schemas/shared/subschemas";
import { TIME_VALIDATIONS_WHEN_NOT_ALL_DAY } from "../../../src/events/_internal/validations";
import { ENTITY_CATALOG_SETUP_SCHEMA } from "../../../src/core/schemas/shared/subschemas";

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
      const getDefaultEventDatesAndTimesSpy = jest
        .spyOn(
          getDefaultEventDatesAndTimesModule,
          "getDefaultEventDatesAndTimes"
        )
        .mockReturnValue(datesAndTimes);
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
          isAllDay: {
            type: "boolean",
            default: false,
          },
          _catalogSetup: ENTITY_CATALOG_SETUP_SCHEMA,
        },
        allOf: [TIME_VALIDATIONS_WHEN_NOT_ALL_DAY],
      } as IConfigurationSchema);
    });
  });
});
