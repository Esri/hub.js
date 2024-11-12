import { checkPermission } from "../../../../permissions/checkPermission";
import { IArcGISContext } from "../../../../ArcGISContext";
import {
  IConfigurationValues,
  IUiSchema,
  UiSchemaRuleEffects,
} from "../../types";
import { EntityEditorOptions } from "../EditorOptions";
import {
  SHOW_FOR_STATIC_RULE_ENTITY,
  SHOW_FOR_DYNAMIC_RULE_ENTITY,
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
        type: "Notice",
        options: {
          notice: {
            id: "metric-editor-preview-notice",
            title: "{{shared.notices.metrics.preview.label:translate}}",
            message: "{{shared.notices.metrics.preview.message:translate}}",
            configuration: {
              noticeType: "notice",
              icon: true,
              kind: "info",
              closable: false,
              scale: "s",
            },
          },
        },
      },
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
              rules: [
                [],
                [],
                [
                  {
                    effect: UiSchemaRuleEffects.SHOW,
                    // only show in alpha
                    conditions: [
                      checkPermission("hub:availability:alpha", context).access,
                    ],
                  },
                ],
              ],
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
            rules: [SHOW_FOR_STATIC_AND_STRING_RULE_ENTITY],
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
            rules: [SHOW_FOR_STATIC_AND_NUMBER_RULE_ENTITY],
            options: {
              control: "hub-field-input-input",
              clearOnHidden: true,
              type: "number",
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
            rules: [SHOW_FOR_STATIC_AND_DATE_RULE_ENTITY],
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
                  type: "ERROR",
                  keyword: "required",
                  icon: true,
                  labelKey: "shared.fields.metrics.sourceLink.message.required",
                  allowShowBeforeInteract: true,
                },
                {
                  type: "ERROR",
                  keyword: "format",
                  icon: true,
                  labelKey: "shared.errors.urlFormat",
                },
                {
                  type: "ERROR",
                  keyword: "if",
                  hidden: true,
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
    ],
  };
};

/**
 * @private
 * constructs the default values for the project metrics editor.
 * This is used to pre-populate the metrics editor with specific default values
 * that are different from the Schema default values, or contain translated
 * values.
 * @param i18nScope
 * @param options
 * @param context
 * @returns
 */
export const buildDefaults = async (
  i18nScope: string,
  options: EntityEditorOptions,
  context: IArcGISContext
): Promise<IConfigurationValues> => {
  return {
    _metric: {
      cardTitle: `{{shared.fields.metrics.cardTitle.label:translate}}`,
    },
  };
};
