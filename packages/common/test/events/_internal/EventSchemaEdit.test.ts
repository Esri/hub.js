import { buildSchema } from "../../../src/events/_internal/EventSchemaEdit";
import { IConfigurationSchema } from "../../../src/core/schemas/types";
import {
  ENTITY_CATEGORIES_SCHEMA,
  ENTITY_FEATURED_CONTENT_SCHEMA,
  ENTITY_NAME_SCHEMA,
  ENTITY_SUMMARY_SCHEMA,
  ENTITY_TAGS_SCHEMA,
} from "../../../src/core/schemas/shared/subschemas";
import {
  HubEventAttendanceType,
  HubEventCapacityType,
} from "../../../src/events/types";
import {
  FIXED_IN_PERSON_ATTENDANCE_VALIDATIONS,
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
      const res = buildSchema();
      expect(res).toEqual({
        required: ["name", "startDate", "endDate", "timeZone"],
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
          timeZone: {
            type: "string",
          },
          inPersonCapacity: {
            type: "number",
          },
          inPersonCapacityType: {
            type: "string",
            enum: [HubEventCapacityType.Unlimited, HubEventCapacityType.Fixed],
            default: HubEventCapacityType.Unlimited,
          },
          location: {
            type: "object",
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
            enum: [HubEventCapacityType.Unlimited, HubEventCapacityType.Fixed],
            default: HubEventCapacityType.Unlimited,
          },
          summary: ENTITY_SUMMARY_SCHEMA,
          tags: ENTITY_TAGS_SCHEMA,
          categories: ENTITY_CATEGORIES_SCHEMA,
          view: {
            type: "object",
            properties: {
              featuredContentIds: {
                ...ENTITY_FEATURED_CONTENT_SCHEMA,
                default: [],
                maxItems: 1,
              },
            },
          },
        },
        allOf: [
          URL_VALIDATIONS_WHEN_ONLINE_OR_HYBRID,
          TIME_VALIDATIONS_WHEN_NOT_ALL_DAY,
          FIXED_ONLINE_ATTENDANCE_VALIDATIONS,
          FIXED_IN_PERSON_ATTENDANCE_VALIDATIONS,
        ],
      } as IConfigurationSchema);
    });
  });
});
