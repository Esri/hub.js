import { IArcGISContext } from "../../../../ArcGISContext";
import { IUiSchema } from "../../types";
import { EntityEditorOptions } from "../EditorOptions";
import {
  SHOW_FOR_STATIC_RULE_ENTITY,
  SHOW_FOR_DYNAMIC_RULE_ENTITY,
  SHOW_FOR_SHARING_RULE_ENTITY,
  SHOW_FOR_STATIC_AND_STRING_RULE_ENTITY,
  SHOW_FOR_STATIC_AND_NUMBER_RULE_ENTITY,
  SHOW_FOR_STATIC_AND_DATE_RULE_ENTITY,
} from "./rules";

/**
 * @private
 * Exports the uiSchema of metrics for projects
 * @param i18nScope
 * @param config
 * @param context
 * @returns
 */
export const buildUiSchema = async (
  i18nScope: string,
  config: EntityEditorOptions,
  context: IArcGISContext
): Promise<IUiSchema> => {
  return {
    type: "Layout",
    elements: [
      {
        type: "Section",
        labelKey: "shared.sections.metrics.basic.label",
        elements: [
          {
            labelKey: "shared.fields.metrics.cardTitle.label",
            scope: "/properties/_metric/properties/cardTitle",
            type: "Control",
            options: {
              messages: [
                {
                  type: "ERROR",
                  keyword: "required",
                  labelKey: "shared.fields.metrics.cardTitle.message.required",
                  icon: true,
                },
              ],
            },
          },
        ],
      },
      {
        type: "Section",
        labelKey: "shared.sections.metrics.source.label",
        elements: [
          {
            labelKey: "shared.fields.metrics.type.label",
            scope: "/properties/_metric/properties/type",
            type: "Control",
            options: {
              control: "hub-field-input-tile-select",
              enum: {
                i18nScope: "shared.fields.metrics.type.enum",
              },
            },
          },
          {
            scope: "/properties/_metric/properties/valueType",
            type: "Control",
            labelKey: "shared.fields.metrics.valueType.label",
            rule: SHOW_FOR_STATIC_RULE_ENTITY,
            options: {
              control: "hub-field-input-tile-select",
              layout: "horizontal",
              helperText: {
                labelKey: "shared.fields.metrics.valueType.helperText",
                placement: "top",
              },
              enum: {
                i18nScope: "shared.fields.metrics.valueType.enum",
              },
            },
          },
          {
            labelKey: "shared.fields.metrics.value.label",
            scope: "/properties/_metric/properties/value",
            type: "Control",
            rule: SHOW_FOR_STATIC_AND_STRING_RULE_ENTITY,
            options: {
              control: "hub-field-input-input",
              clearOnHidden: true,
              messages: [
                {
                  type: "ERROR",
                  keyword: "required",
                  labelKey: "shared.fields.metrics.value.message.required",
                  icon: true,
                },
              ],
            },
          },
          {
            labelKey: "shared.fields.metrics.value.label",
            scope: "/properties/_metric/properties/value",
            type: "Control",
            rule: SHOW_FOR_STATIC_AND_NUMBER_RULE_ENTITY,
            options: {
              control: "hub-field-input-input",
              type: "number",
              clearOnHidden: true,
              messages: [
                {
                  type: "ERROR",
                  keyword: "required",
                  labelKey: "shared.fields.metrics.value.message.required",
                  icon: true,
                },
              ],
            },
          },
          {
            labelKey: "shared.fields.metrics.value.label",
            scope: "/properties/_metric/properties/value",
            type: "Control",
            rule: SHOW_FOR_STATIC_AND_DATE_RULE_ENTITY,
            options: {
              control: "hub-field-input-date",
              clearOnHidden: true,
              messages: [
                {
                  type: "ERROR",
                  keyword: "required",
                  labelKey: "shared.fields.metrics.value.message.required",
                  icon: true,
                },
              ],
            },
          },
          {
            scope: "/properties/_metric/properties/dynamicMetric",
            type: "Control",
            labelKey: "shared.fields.metrics.dynamicMetric.label",
            rule: SHOW_FOR_DYNAMIC_RULE_ENTITY,
            options: {
              control: "hub-composite-input-service-query-metric",
            },
          },
          {
            labelKey: "shared.fields.metrics.unit.label",
            scope: "/properties/_metric/properties/unit",
            type: "Control",
            options: {
              helperText: {
                labelKey: "shared.fields.metrics.unit.helperText",
                placement: "top",
              },
            },
          },
          {
            labelKey: "shared.fields.metrics.unitPosition.label",
            scope: "/properties/_metric/properties/unitPosition",
            type: "Control",
            options: {
              control: "hub-field-input-select",
              enum: {
                i18nScope: "shared.fields.metrics.unitPosition.enum",
              },
            },
          },
        ],
      },
      {
        type: "Section",
        labelKey: "shared.sections.metrics.formatting.label",
        elements: [
          {
            labelKey: "shared.fields.metrics.trailingText.label",
            scope: "/properties/_metric/properties/trailingText",
            type: "Control",
          },
          {
            labelKey: "shared.fields.metrics.sourceLink.label",
            scope: "/properties/_metric/properties/sourceLink",
            type: "Control",
            rule: SHOW_FOR_STATIC_RULE_ENTITY,
            options: {
              placeholder: "https://esri.com",
              messages: [
                {
                  /** not in use until conditional required lands */
                  type: "ERROR",
                  keyword: "required",
                  icon: true,
                  labelKey: "shared.fields.metrics.sourceLink.message.required",
                  allowShowBeforeInteract: true,
                },
              ],
            },
          },
          {
            labelKey: "shared.fields.metrics.sourceTitle.label",
            scope: "/properties/_metric/properties/sourceTitle",
            type: "Control",
            rule: SHOW_FOR_STATIC_RULE_ENTITY,
          },
          {
            type: "Control",
            scope: "/properties/_metric/properties/allowDynamicLink",
            labelKey: "shared.fields.metrics.allowDynamicLink.label",
            rule: SHOW_FOR_DYNAMIC_RULE_ENTITY,
            options: {
              layout: "inline-space-between",
              control: "hub-field-input-switch",
            },
          },
        ],
      },
      {
        type: "Section",
        labelKey: "shared.sections.metrics.sharing.label",
        elements: [
          {
            labelKey: "shared.fields.metrics.showShareIcon.label",
            scope: "/properties/_metric/properties/shareable",
            type: "Control",
            options: {
              helperText: {
                labelKey:
                  "shared.fields.metrics.showShareIcon.helperText.label",
              },
              control: "hub-field-input-switch",
              layout: "inline-space-between",
            },
          },
          {
            labelKey: "shared.fields.metrics.shareableOnHover.label",
            scope: "/properties/_metric/properties/shareableOnHover",
            type: "Control",
            rule: SHOW_FOR_SHARING_RULE_ENTITY,
            options: {
              control: "hub-field-input-switch",
              helperText: {
                labelKey:
                  "shared.fields.metrics.shareableOnHover.helperText.label",
              },
              layout: "inline-space-between",
            },
          },
        ],
      },
    ],
  };
};
