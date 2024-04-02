import { IConfigurationSchema } from "../../core/schemas/types";
import { ENTITY_NAME_SCHEMA } from "../../core/schemas/shared/subschemas";
import { getDefaultEventDatesAndTimes } from "./getDefaultEventDatesAndTimes";

export type EventEditorType = (typeof EventEditorTypes)[number];
export const EventEditorTypes = ["hub:event:create"] as const;

/**
 * @private
 * Builds a schema for an Event that enforces a startDate relative to the user's locale
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
        enum: ["inPerson", "online", "both"],
        default: "inPerson",
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
      {
        if: {
          properties: {
            attendanceType: { enum: ["online", "both"] },
          },
        },
        then: {
          required: ["onlineUrl"],
          properties: {
            onlineUrl: {
              format: "url" as string,
            },
          },
        },
      },
      {
        if: {
          properties: {
            isAllDay: { const: false },
          },
        },
        then: {
          required: ["startTime", "endTime"],
          properties: {
            endTime: {
              format: "timePickerTime",
              formatExclusiveMinimum: { $data: "1/startTime" },
            },
          },
        },
      },
    ],
  } as IConfigurationSchema;
};
