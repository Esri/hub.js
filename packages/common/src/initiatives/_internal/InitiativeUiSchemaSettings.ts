import type { IArcGISContext } from "../../types/IArcGISContext";
import { IUiSchema } from "../../core/schemas/types";
import { IHubInitiative } from "../../core/types";

/**
 * @private
 * constructs the settings uiSchema for Hub Initiatives.
 * This defines how the schema should be rendered
 * in the initiative settings pane
 */
export const buildUiSchema = async (
  i18nScope: string,
  options: Partial<IHubInitiative>,
  context: IArcGISContext
): Promise<IUiSchema> => {
  return {
    type: "Layout",
    elements: [
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
