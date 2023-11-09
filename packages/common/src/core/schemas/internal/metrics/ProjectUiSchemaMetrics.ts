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
        labelKey: `${i18nScope}.fields.cardTitle.label`,
        scope: "/properties/_metrics/properties/cardTitle",
        type: "Control",
      },
      {
        labelKey: `${i18nScope}.fields.value.label`,
        scope: "/properties/_metrics/properties/value",
        type: "Control",
      },
      {
        labelKey: `${i18nScope}.fields.units.label`,
        scope: "/properties/_metrics/properties/units",
        type: "Control",
        options: {
          helperText: {
            labelKey: `${i18nScope}.fields.units.helperText`,
            placement: "bottom",
          },
        },
      },
      {
        labelKey: `${i18nScope}.fields.unitPosition.label`,
        scope: "/properties/_metrics/properties/unitPosition",
        type: "Control",
        options: {
          control: "hub-field-input-select",
          enum: {
            i18nScope: `${i18nScope}.metrics.unitPosition.enum`,
          },
        },
      },
      {
        labelKey: `${i18nScope}.fields.trailingText.label`,
        scope: "/properties/_metrics/properties/trailingText",
        type: "Control",
      },
    ],
  };
};
