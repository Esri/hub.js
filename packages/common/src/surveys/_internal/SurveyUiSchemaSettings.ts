import { IArcGISContext } from "../../ArcGISContext";
import { EntityEditorOptions } from "../../core/schemas/internal/EditorOptions";
import { IUiSchema, UiSchemaRuleEffects } from "../../core/schemas/types";

/**
 * @private
 * settings uiSchema for Hub Survey - this
 * defines how the schema properties should be
 * rendered in the Survey settings experience
 */
export const buildUiSchema = async (
  i18nScope: string,
  options: EntityEditorOptions,
  context: IArcGISContext
): Promise<IUiSchema> => {
  return {
    type: "Layout",
    elements: [
      {
        type: "Section",
        rule: {
          effect: UiSchemaRuleEffects.SHOW,
          condition: {
            scope: "/properties/hasMapQuestion",
            schema: { const: true },
          },
        },
        labelKey: `${i18nScope}.sections.settings.label`,
        elements: [
          {
            labelKey: `${i18nScope}.fields.displayMap.label`,
            scope: "/properties/displayMap",
            type: "Control",
            options: {
              control: "hub-field-input-tile-select",
              type: "radio",
              layout: "horizontal",
              labels: [
                `{{${i18nScope}.fields.displayMap.enabled.label:translate}}`,
                `{{${i18nScope}.fields.displayMap.disabled.label:translate}}`,
              ],
              descriptions: [
                `{{${i18nScope}.fields.displayMap.enabled.description:translate}}`,
                `{{${i18nScope}.fields.displayMap.disabled.description:translate}}`,
              ],
              icons: ["sidecar", "form-elements"],
            },
          },
        ],
      },
    ],
  };
};
