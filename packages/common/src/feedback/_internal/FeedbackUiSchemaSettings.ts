import { IArcGISContext } from "../../ArcGISContext";
import { IUiSchema } from "../../core";
import { EntityEditorOptions } from "../../core/schemas/internal/EditorOptions";

/**
 * @private
 * settings uiSchema for Hub Feedback - this
 * defines how the schema properties should be
 * rendered in the Feedback settings experience
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
        labelKey: `${i18nScope}.sections.settings.label`,
        elements: [
          {
            labelKey: `${i18nScope}.fields.displayMap.label`,
            scope: "/properties/displayMap",
            type: "Control",
            options: {
              control: "hub-field-input-radio",
              labels: [
                `{{${i18nScope}.fields.displayMap.enabled.label:translate}}`,
                `{{${i18nScope}.fields.displayMap.disabled.label:translate}}`,
              ],
              descriptions: [
                `{{${i18nScope}.fields.displayMap.enabled.description:translate}}`,
                `{{${i18nScope}.fields.displayMap.disabled.description:translate}}`,
              ],
              icons: ["sidecard", "form-elements"],
            },
          },
        ],
      },
    ],
  };
};
