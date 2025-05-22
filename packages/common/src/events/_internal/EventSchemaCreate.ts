import { IConfigurationSchema } from "../../core/schemas/types";
import { ENTITY_NAME_SCHEMA } from "../../core/schemas/shared/subschemas";
import { getDefaultEventDatesAndTimes } from "./getDefaultEventDatesAndTimes";
import {
  TIME_VALIDATIONS_WHEN_NOT_ALL_DAY,
} from "./validations";

export type EventEditorType = (typeof EventEditorTypes)[number];
export const EventEditorTypes = [
  "hub:event:create",
  "hub:event:edit",
  "hub:event:registrants",
] as const;

/**
 * @private
 * Builds a schema for creating a new Event that enforces a startDate relative to the user's locale
 */
export const buildSchema = (): IConfigurationSchema => {
  const { startDate } = getDefaultEventDatesAndTimes();
  return {
    $async: true,
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
      isAllDay: {
        type: "boolean",
        default: false,
      },
      /* This field hidden for future consideration */
      // referencedContentIds: {
      //   type: "array",
      //   maxItems: 1,
      //   items: {
      //     type: "string",
      //   },
      //   default: [],
      // },
    },
    allOf: [TIME_VALIDATIONS_WHEN_NOT_ALL_DAY],
  } as IConfigurationSchema;
};
