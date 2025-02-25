import type { IArcGISContext } from "../../IArcGISContext";
import { IUiSchema } from "../../core/schemas/types";
import { EntityEditorOptions } from "../../core/schemas/internal/EditorOptions";

/**
 * @private
 * settings uiSchema for Hub Discussions - this
 * defines how the schema properties should be
 * rendered in the Discussions settings experience
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
            labelKey: `${i18nScope}.fields.discussable.label`,
            scope: "/properties/isDiscussable",
            type: "Control",
            options: {
              control: "hub-field-input-radio",
              labels: [
                `{{${i18nScope}.fields.discussable.enabled.label:translate}}`,
                `{{${i18nScope}.fields.discussable.disabled.label:translate}}`,
              ],
              descriptions: [
                `{{${i18nScope}.fields.discussable.enabled.description:translate}}`,
                `{{${i18nScope}.fields.discussable.disabled.description:translate}}`,
              ],
              icons: ["speech-bubbles", "circle-disallowed"],
            },
          },
        ],
      },
      {
        type: "Section",
        labelKey: `shared.sections.mapSettings.label`,
        elements: [
          {
            type: "Control",
            scope: "/properties/view/properties/mapSettings",
            labelKey: `${i18nScope}.fields.mapSettings.label`,
            options: {
              type: "Control",
              control: "hub-composite-input-map-settings",
              // the settings that are visible for configuring the map
              visibleSettings: ["gallery"],
              // if the map preview is displayed
              showPreview: true,
            },
          },
        ],
      },
    ],
  };
};
