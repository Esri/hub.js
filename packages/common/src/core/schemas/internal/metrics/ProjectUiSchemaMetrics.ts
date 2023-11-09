import { IArcGISContext } from "../../../../ArcGISContext";
import { IUiSchema } from "../../types";
import { EntityEditorOptions } from "../EditorOptions";

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
  // To be filled out in a later issue
  return {
    type: "Layout",
    elements: [
      {
        type: "Section",
        elements: [
          {
            labelKey: `${i18nScope}.fields.cardTitle.label`,
            scope: "/properties/_metric/properties/cardTitle",
            type: "Control",
            options: {
              messages: [
                {
                  type: "ERROR",
                  keyword: "minLength",
                  labelKey: `${i18nScope}.fields.cardTitle.message.minLength`,
                  icon: true,
                  allowShowBeforeInteract: true,
                },
              ],
            },
          },
          {
            type: "Section",
            labelKey: `${i18nScope}.sections.source.label`,
            options: {
              section: "block",
              open: true,
            },
            elements: [
              {
                labelKey: `${i18nScope}.fields.value.label`,
                scope: "/properties/_metric/properties/value",
                type: "Control",
                options: {
                  messages: [
                    {
                      type: "ERROR",
                      keyword: "minLength",
                      labelKey: `${i18nScope}.fields.value.message.minLength`,
                      icon: true,
                      allowShowBeforeInteract: true,
                    },
                  ],
                },
              },
            ],
          },
          {
            type: "Section",
            labelKey: `${i18nScope}.sections.formatting.label`,
            options: {
              section: "block",
              open: true,
            },
            elements: [
              {
                labelKey: `${i18nScope}.fields.unit.label`,
                scope: "/properties/_metric/properties/unit",
                type: "Control",
                options: {
                  helperText: {
                    labelKey: `${i18nScope}.fields.unit.helperText`,
                    placement: "bottom",
                  },
                },
              },
              {
                labelKey: `${i18nScope}.fields.unitPosition.label`,
                scope: "/properties/_metric/properties/unitPosition",
                type: "Control",
                options: {
                  control: "hub-field-input-select",
                  enum: {
                    i18nScope: `${i18nScope}.fields.unitPosition.enum`,
                  },
                },
              },
            ],
          },
          {
            type: "Section",
            labelKey: `${i18nScope}.sections.appearance.label`,
            options: {
              section: "block",
              open: false,
            },
            elements: [
              {
                labelKey: `${i18nScope}.fields.trailingText.label`,
                scope: "/properties/_metric/properties/trailingText",
                type: "Control",
              },
            ],
          },
        ],
      },
    ],
  };
};
