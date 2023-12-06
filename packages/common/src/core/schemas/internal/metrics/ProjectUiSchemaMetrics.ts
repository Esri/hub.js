import { IArcGISContext } from "../../../../ArcGISContext";
import { IUiSchema } from "../../types";
import { EntityEditorOptions } from "../EditorOptions";
import {
  SHOW_FOR_STATIC_RULE_ENTITY,
  SHOW_FOR_DYNAMIC_RULE_ENTITY,
  SHOW_FOR_SHARING_RULE_ENTITY,
} from "./resources";

/**
 * @private
 * Exports the uiSchema of metrics for projects
 * @param i18nScope
 * @param config
 * @param context
 * @returns
 */
export const buildUiSchema = (
  i18nScope: string,
  config: EntityEditorOptions,
  context: IArcGISContext
): IUiSchema => {
  return {
    type: "Layout",
    elements: [
      {
        type: "Section",
        elements: [
          {
            labelKey: `${i18nScope}.fields.metrics.cardTitle.label`,
            scope: "/properties/_metric/properties/cardTitle",
            type: "Control",
            options: {
              messages: [
                {
                  type: "ERROR",
                  keyword: "minLength",
                  labelKey: `${i18nScope}.fields.metrics.cardTitle.message.minLength`,
                  icon: true,
                  allowShowBeforeInteract: true,
                },
              ],
            },
          },
          {
            type: "Section",
            labelKey: `${i18nScope}.sections.metrics.source.label`,
            elements: [
              {
                labelKey: `${i18nScope}.fields.metrics.type.label`,
                scope: "/properties/_metric/properties/type",
                type: "Control",
                options: {
                  control: "hub-field-input-tile-select",
                  enum: {
                    i18nScope: `${i18nScope}.fields.metrics.type.enum`,
                  },
                },
              },
              {
                labelKey: `${i18nScope}.fields.metrics.value.label`,
                scope: "/properties/_metric/properties/value",
                type: "Control",
                rule: SHOW_FOR_STATIC_RULE_ENTITY,
                options: {
                  messages: [
                    {
                      type: "ERROR",
                      keyword: "minLength",
                      labelKey: `${i18nScope}.fields.metrics.value.message.minLength`,
                      icon: true,
                      allowShowBeforeInteract: true,
                    },
                  ],
                },
              },
              {
                scope: "/properties/_metric/properties/dynamicMetric",
                type: "Control",
                labelKey: `${i18nScope}.fields.metrics.dynamicMetric.label`,
                rule: SHOW_FOR_DYNAMIC_RULE_ENTITY,
                options: {
                  control: "hub-composite-input-service-query-metric",
                },
              },
              {
                labelKey: `${i18nScope}.fields.metrics.unit.label`,
                scope: "/properties/_metric/properties/unit",
                type: "Control",
                options: {
                  helperText: {
                    labelKey: `${i18nScope}.fields.metrics.unit.helperText`,
                    placement: "bottom",
                  },
                },
              },
              {
                labelKey: `${i18nScope}.fields.metrics.unitPosition.label`,
                scope: "/properties/_metric/properties/unitPosition",
                type: "Control",
                options: {
                  control: "hub-field-input-select",
                  enum: {
                    i18nScope: `${i18nScope}.fields.metrics.unitPosition.enum`,
                  },
                },
              },
            ],
          },
          {
            type: "Section",
            labelKey: `${i18nScope}.sections.metrics.formatting.label`,
            elements: [
              {
                labelKey: `${i18nScope}.fields.metrics.trailingText.label`,
                scope: "/properties/_metric/properties/trailingText",
                type: "Control",
              },
              {
                labelKey: `${i18nScope}.fields.metrics.sourceLink.label`,
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
                      labelKey: `${i18nScope}.fields.metrics.sourceLink.message.required`,
                      allowShowBeforeInteract: true,
                    },
                  ],
                },
              },
              {
                labelKey: `${i18nScope}.fields.metrics.sourceTitle.label`,
                scope: "/properties/_metric/properties/sourceTitle",
                type: "Control",
                rule: SHOW_FOR_STATIC_RULE_ENTITY,
              },
              {
                type: "Control",
                scope: "/properties/_metric/properties/allowDynamicLink",
                labelKey: `${i18nScope}.fields.metrics.allowDynamicLink.label`,
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
            labelKey: `${i18nScope}.sections.metrics.sharing.label`,
            elements: [
              {
                labelKey: `${i18nScope}.fields.metrics.showShareIcon.label`,
                scope: "/properties/_metric/properties/shareable",
                type: "Control",
                options: {
                  helperText: {
                    labelKey: `${i18nScope}.fields.metrics.showShareIcon.helperText.label`,
                  },
                  control: "hub-field-input-switch",
                  layout: "inline-space-between",
                },
              },
              {
                labelKey: `${i18nScope}.fields.metrics.shareableOnHover.label`,
                scope: "/properties/_metric/properties/shareableOnHover",
                type: "Control",
                rule: SHOW_FOR_SHARING_RULE_ENTITY,
                options: {
                  control: "hub-field-input-switch",
                  helperText: {
                    labelKey: `${i18nScope}.fields.metrics.shareableOnHover.helperText.label`,
                  },
                  layout: "inline-space-between",
                },
              },
            ],
          },
        ],
      },
    ],
  };
};
