import {
  ENTITY_CATEGORIES_SCHEMA,
  ENTITY_NAME_SCHEMA,
  ENTITY_SUMMARY_SCHEMA,
  ENTITY_TAGS_SCHEMA,
} from "../../core/schemas/shared/subschemas";
import { IConfigurationSchema } from "../../core/schemas/types";
import { HubEventAttendanceType, HubEventCapacityType } from "../types";
import {
  URL_VALIDATIONS_WHEN_ONLINE_OR_HYBRID,
  TIME_VALIDATIONS_WHEN_NOT_ALL_DAY,
  FIXED_ONLINE_ATTENDANCE_VALIDATIONS,
  FIXED_IN_PERSON_ATTENDANCE_VALIDATIONS,
} from "./validations";
import { getDefaultEventDatesAndTimes } from "./getDefaultEventDatesAndTimes";

/**
 * @private
 * Builds a schema for creating a new Event that enforces a startDate relative to the user's locale
 */
export const buildSchema = (): IConfigurationSchema => {
  const { startDate: minStartDate } = getDefaultEventDatesAndTimes();
  return {
    required: ["name", "description", "startDate", "endDate", "timeZone"],
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
    },
    allOf: [
      URL_VALIDATIONS_WHEN_ONLINE_OR_HYBRID,
      TIME_VALIDATIONS_WHEN_NOT_ALL_DAY,
      FIXED_ONLINE_ATTENDANCE_VALIDATIONS,
      FIXED_IN_PERSON_ATTENDANCE_VALIDATIONS,
    ],
  } as IConfigurationSchema;
};
