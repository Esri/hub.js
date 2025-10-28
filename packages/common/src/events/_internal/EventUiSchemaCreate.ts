import { IUiSchema } from "../../core/schemas/types";
import { UiSchemaRuleEffects } from "../../core/enums/uiSchemaRuleEffects";
import type { IArcGISContext } from "../../types/IArcGISContext";
import { EntityEditorOptions } from "../../core/schemas/internal/EditorOptions";
import { getDatePickerDate } from "../../utils/date/getDatePickerDate";
import { IHubEvent } from "../../core/types/IHubEvent";
import { buildCatalogSetupUiSchemaElement } from "../../core/schemas/internal/buildCatalogSetupUiSchemaElement";

/**
 * @private
 * constructs the complete create uiSchema for Hub Events.
 * This defines how the schema properties should be
 * rendered in the event creation experience
 */
export const buildUiSchema = (
  i18nScope: string,
  options: EntityEditorOptions,
  context: IArcGISContext
): Promise<IUiSchema> => {
  const minStartDate = getDatePickerDate(
    new Date(),
    (options as IHubEvent).timeZone
  );
  return Promise.resolve({
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
      ...buildCatalogSetupUiSchemaElement(i18nScope, context),
      /* This field hidden for future consideration */
      // buildReferencedContentSchema(
      //   i18nScope,
      //   context,
      //   `{{${i18nScope}.fields.referencedContent.label:translate}}`
      // ),
    ],
  });
};
