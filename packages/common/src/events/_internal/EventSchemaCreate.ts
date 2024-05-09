import { IConfigurationSchema } from "../../core/schemas/types";
import { ENTITY_NAME_SCHEMA } from "../../core/schemas/shared/subschemas";
import { getDefaultEventDatesAndTimes } from "./getDefaultEventDatesAndTimes";
import { HubEventAttendanceType } from "../types";
import {
  URL_VALIDATIONS_WHEN_ONLINE_OR_HYBRID,
  TIME_VALIDATIONS_WHEN_NOT_ALL_DAY,
} from "./validations";

export type EventEditorType = (typeof EventEditorTypes)[number];
export const EventEditorTypes = [
  "hub:event:create",
  "hub:event:edit",
  "hub:event:attendees",
] as const;

/**
 * @private
 * Builds a schema for creating a new Event that enforces a startDate relative to the user's locale
 */
export const buildSchema = (): IConfigurationSchema => {
  const { startDate } = getDefaultEventDatesAndTimes();
  return {
    required: ["name", "startDate", "endDate"],
    properties: {
      name: ENTITY_NAME_SCHEMA,
      startDate: {
        type: "string",
        format: "date",
        formatMinimum: startDate,
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
  } as IConfigurationSchema;
};
