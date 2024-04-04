import { IUiSchema, UiSchemaRuleEffects } from "../../core/schemas/types";
import { IArcGISContext } from "../../ArcGISContext";
import { EntityEditorOptions } from "../../core/schemas/internal/EditorOptions";
import { getDatePickerDate } from "../../utils/date/getDatePickerDate";
import { IHubEvent } from "../../core/types/IHubEvent";
import { HubEventAttendanceType } from "../types";

/**
 * @private
 * constructs the complete create uiSchema for Hub Events.
 * This defines how the schema properties should be
 * rendered in the event creation experience
 */
export const buildUiSchema = async (
  i18nScope: string,
  options: EntityEditorOptions,
  context: IArcGISContext
): Promise<IUiSchema> => {
  const minStartDate = getDatePickerDate(
    new Date(),
    (options as IHubEvent).timeZone
  );
  return {
    type: "Layout",
    elements: [
      {
        labelKey: `${i18nScope}.fields.name.label`,
        scope: "/properties/name",
        type: "Control",
        options: {
          messages: [
            {
              type: "ERROR",
              keyword: "required",
              icon: true,
              labelKey: `${i18nScope}.fields.name.requiredError`,
            },
            {
              type: "ERROR",
              keyword: "maxLength",
              icon: true,
              labelKey: `shared.fields.title.maxLengthError`,
            },
          ],
        },
      },
      {
        labelKey: `${i18nScope}.fields.date.label`,
        scope: "/properties/startDate",
        type: "Control",
        options: {
          control: "hub-field-input-date",
          min: minStartDate,
          messages: [
            {
              type: "ERROR",
              keyword: "required",
              icon: true,
              labelKey: `${i18nScope}.fields.date.requiredError`,
            },
            {
              type: "ERROR",
              keyword: "formatMinimum",
              icon: true,
              labelKey: `${i18nScope}.fields.date.minDateError`,
            },
          ],
        },
      },
      {
        labelKey: `${i18nScope}.fields.allDay.label`,
        type: "Control",
        scope: "/properties/isAllDay",
        options: {
          control: "hub-field-input-switch",
        },
      },
      {
        labelKey: `${i18nScope}.fields.startTime.label`,
        scope: "/properties/startTime",
        type: "Control",
        rule: {
          condition: {
            scope: "/properties/isAllDay",
            schema: { const: false },
          },
          effect: UiSchemaRuleEffects.SHOW,
        },
        options: {
          control: "hub-field-input-time",
          messages: [
            {
              type: "ERROR",
              keyword: "required",
              icon: true,
              labelKey: `${i18nScope}.fields.startTime.requiredError`,
            },
          ],
        },
      },
      {
        labelKey: `${i18nScope}.fields.endTime.label`,
        scope: "/properties/endTime",
        type: "Control",
        rule: {
          condition: {
            scope: "/properties/isAllDay",
            schema: { const: false },
          },
          effect: UiSchemaRuleEffects.SHOW,
        },
        options: {
          control: "hub-field-input-time",
          messages: [
            {
              type: "ERROR",
              keyword: "required",
              icon: true,
              labelKey: `${i18nScope}.fields.endTime.requiredError`,
            },
            {
              type: "ERROR",
              keyword: "formatExclusiveMinimum",
              icon: true,
              labelKey: `${i18nScope}.fields.endTime.minTimeError`,
            },
          ],
        },
      },
      {
        labelKey: `${i18nScope}.fields.attendanceType.label`,
        scope: "/properties/attendanceType",
        type: "Control",
        options: {
          control: "hub-field-input-radio-group",
          enum: { i18nScope: `${i18nScope}.fields.attendanceType` },
        },
      },
      {
        labelKey: `${i18nScope}.fields.onlineUrl.label`,
        scope: "/properties/onlineUrl",
        type: "Control",
        rule: {
          condition: {
            scope: "/properties/attendanceType",
            schema: {
              enum: [
                HubEventAttendanceType.Online,
                HubEventAttendanceType.Both,
              ],
            },
          },
          effect: UiSchemaRuleEffects.SHOW,
        },
        options: {
          control: "hub-field-input-input",
          messages: [
            {
              type: "ERROR",
              keyword: "required",
              icon: true,
              labelKey: `${i18nScope}.fields.onlineUrl.requiredError`,
            },
            {
              type: "ERROR",
              keyword: "format",
              icon: true,
              labelKey: `${i18nScope}.fields.onlineUrl.linkHrefFormatError`,
            },
          ],
        },
      },
    ],
  };
};
