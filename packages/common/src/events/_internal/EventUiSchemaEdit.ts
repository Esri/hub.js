import { IUiSchema, UiSchemaRuleEffects } from "../../core/schemas/types";
import { IArcGISContext } from "../../ArcGISContext";
import { getDatePickerDate } from "../../utils/date/getDatePickerDate";
import { IHubEvent } from "../../core/types/IHubEvent";
import { getTagItems } from "../../core/schemas/internal/getTagItems";
import { HubEventAttendanceType, HubEventCapacityType } from "../types";
import { getLocationExtent } from "../../core/schemas/internal/getLocationExtent";
import { getLocationOptions } from "../../core/schemas/internal/getLocationOptions";
import { fetchCategoriesUiSchemaElement } from "../../core/schemas/internal/fetchCategoriesUiSchemaElement";

/**
 * @private
 * constructs the complete edit uiSchema for Hub Events.
 * This defines how the schema properties should be
 * rendered in the event creation experience
 */
export const buildUiSchema = async (
  i18nScope: string,
  options: Partial<IHubEvent>,
  context: IArcGISContext
): Promise<IUiSchema> => {
  const minStartEndDate = getDatePickerDate(
    new Date(),
    (options as IHubEvent).timeZone
  );
  return {
    type: "Layout",
    elements: [
      {
        type: "Section",
        labelKey: `${i18nScope}.sections.eventInfo.label`,
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
            labelKey: `${i18nScope}.fields.description.label`,
            scope: "/properties/description",
            type: "Control",
            options: {
              control: "hub-field-input-rich-text",
              type: "textarea",
              helperText: {
                labelKey: `${i18nScope}.fields.description.helperText`,
              },
              messages: [
                {
                  type: "ERROR",
                  keyword: "required",
                  icon: true,
                  labelKey: `${i18nScope}.fields.description.requiredError`,
                },
              ],
            },
          },
        ],
      },
      {
        type: "Section",
        labelKey: `${i18nScope}.sections.dateTime.label`,
        elements: [
          {
            labelKey: `${i18nScope}.fields.startDate.label`,
            scope: "/properties/startDate",
            type: "Control",
            options: {
              control: "hub-field-input-date",
              messages: [
                {
                  type: "ERROR",
                  keyword: "required",
                  icon: true,
                  labelKey: `${i18nScope}.fields.startDate.requiredError`,
                },
              ],
            },
          },
          {
            labelKey: `${i18nScope}.fields.endDate.label`,
            scope: "/properties/endDate",
            type: "Control",
            options: {
              control: "hub-field-input-date",
              messages: [
                {
                  type: "ERROR",
                  keyword: "required",
                  icon: true,
                  labelKey: `${i18nScope}.fields.endDate.requiredError`,
                },
                {
                  type: "ERROR",
                  keyword: "formatMinimum",
                  icon: true,
                  labelKey: `${i18nScope}.fields.endDate.minDateError`,
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
            labelKey: `${i18nScope}.fields.timeZone.label`,
            scope: "/properties/timeZone",
            type: "Control",
            options: {
              control: "hub-field-input-time-zone",
              messages: [
                {
                  type: "ERROR",
                  keyword: "required",
                  icon: true,
                  labelKey: `${i18nScope}.fields.timeZone.requiredError`,
                },
              ],
            },
          },
        ],
      },
      {
        type: "Section",
        labelKey: `${i18nScope}.sections.location.label`,
        elements: [
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
            scope: "/properties/location",
            type: "Control",
            labelKey: `${i18nScope}.fields.location.label`,
            options: {
              control: "hub-field-input-location-picker",
              extent: await getLocationExtent(
                options.location,
                context.hubRequestOptions
              ),
              options: await getLocationOptions(
                options.id,
                options.type,
                options.location,
                context.portal.name,
                context.hubRequestOptions
              ),
            },
          },
          {
            labelKey: `${i18nScope}.fields.inPersonCapacityType.label`,
            scope: "/properties/inPersonCapacityType",
            type: "Control",
            rule: {
              condition: {
                scope: "/properties/attendanceType",
                schema: {
                  enum: [
                    HubEventAttendanceType.InPerson,
                    HubEventAttendanceType.Both,
                  ],
                },
              },
              effect: UiSchemaRuleEffects.SHOW,
            },
            options: {
              control: "hub-field-input-radio-group",
              enum: { i18nScope: `${i18nScope}.fields.inPersonCapacityType` },
            },
          },
          {
            labelKey: `${i18nScope}.fields.inPersonCapacity.label`,
            scope: "/properties/inPersonCapacity",
            type: "Control",
            rule: {
              condition: {
                schema: {
                  properties: {
                    attendanceType: {
                      enum: [
                        HubEventAttendanceType.InPerson,
                        HubEventAttendanceType.Both,
                      ],
                    },
                    inPersonCapacityType: {
                      const: HubEventCapacityType.Fixed,
                    },
                  },
                },
              },
              effect: UiSchemaRuleEffects.SHOW,
            },
            options: {
              control: "hub-field-input-input",
              type: "number",
              messages: [
                {
                  type: "ERROR",
                  keyword: "required",
                  icon: true,
                  labelKey: `${i18nScope}.fields.inPersonCapacity.requiredError`,
                },
                {
                  type: "ERROR",
                  keyword: "minimum",
                  icon: true,
                  labelKey: `${i18nScope}.fields.inPersonCapacity.minimumError`,
                },
              ],
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
                  labelKey: `shared.errors.urlFormat`,
                },
              ],
            },
          },
          {
            labelKey: `${i18nScope}.fields.onlineDetails.label`,
            scope: "/properties/onlineDetails",
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
              control: "hub-field-input-rich-text",
              type: "textarea",
              helperText: {
                labelKey: `${i18nScope}.fields.onlineDetails.helperText`,
              },
            },
          },
          {
            labelKey: `${i18nScope}.fields.onlineCapacityType.label`,
            scope: "/properties/onlineCapacityType",
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
              control: "hub-field-input-radio-group",
              enum: { i18nScope: `${i18nScope}.fields.onlineCapacityType` },
            },
          },
          {
            labelKey: `${i18nScope}.fields.onlineCapacity.label`,
            scope: "/properties/onlineCapacity",
            type: "Control",
            rule: {
              condition: {
                schema: {
                  properties: {
                    attendanceType: {
                      enum: [
                        HubEventAttendanceType.Online,
                        HubEventAttendanceType.Both,
                      ],
                    },
                    onlineCapacityType: {
                      const: HubEventCapacityType.Fixed,
                    },
                  },
                },
              },
              effect: UiSchemaRuleEffects.SHOW,
            },
            options: {
              control: "hub-field-input-input",
              type: "number",
              messages: [
                {
                  type: "ERROR",
                  keyword: "required",
                  icon: true,
                  labelKey: `${i18nScope}.fields.onlineCapacity.requiredError`,
                },
                {
                  type: "ERROR",
                  keyword: "minimum",
                  icon: true,
                  labelKey: `${i18nScope}.fields.onlineCapacity.minimumError`,
                },
              ],
            },
          },
        ],
      },
      {
        type: "Section",
        labelKey: `${i18nScope}.sections.discoverability.label`,
        elements: [
          {
            labelKey: `${i18nScope}.fields.tags.label`,
            scope: "/properties/tags",
            type: "Control",
            options: {
              control: "hub-field-input-combobox",
              items: await getTagItems(
                options.tags,
                context.portal.id,
                context.hubRequestOptions
              ),
              allowCustomValues: true,
              selectionMode: "multiple",
              placeholderIcon: "label",
              helperText: {
                labelKey: `${i18nScope}.fields.tags.helperText`,
              },
            },
          },
          await fetchCategoriesUiSchemaElement(i18nScope, context),
          {
            labelKey: `${i18nScope}.fields.summary.label`,
            scope: "/properties/summary",
            type: "Control",
            options: {
              control: "hub-field-input-input",
              type: "textarea",
              rows: 4,
              helperText: {
                labelKey: `${i18nScope}.fields.summary.helperText`,
              },
              messages: [
                {
                  type: "ERROR",
                  keyword: "maxLength",
                  icon: true,
                  labelKey: `shared.fields.summary.maxLengthError`,
                },
              ],
            },
          },
        ],
      },
    ],
  };
};
