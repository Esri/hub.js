import type { IArcGISContext } from "../../types/IArcGISContext";
import { IUiSchema } from "../../core/schemas/types";
import { IHubProject } from "../../core/types/IHubProject";

/**
 * @private
 * constructs the settings uiSchema for Hub Projects.
 * This defines how the schema should be rendered
 * in the project settings pane
 */
export const buildUiSchema = (
  i18nScope: string,
  _options: Partial<IHubProject>,
  _context: IArcGISContext
): Promise<IUiSchema> => {
  return Promise.resolve({
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
  });
};
