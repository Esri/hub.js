import { IArcGISContext } from "../../ArcGISContext";
import { IUiSchema } from "../../core/schemas/types";
import { IEntityEditorOptions } from "../../core/schemas/internal/EditorOptions";

/**
 * @private
 * constructs the edit uiSchema for Hub Sites.
 * This defines how the schema properties should
 * be rendered in the site editing experience
 */
export const buildUiSchema = async (
  i18nScope: string,
  options: IEntityEditorOptions,
  context: IArcGISContext
): Promise<IUiSchema> => {
  return {
    type: "Layout",
    elements: [
      {
        type: "Section",
        elements: [
          {
            scope: "/properties/telemetry/properties/consentNotice",
            type: "Control",
            options: {
              control: "arcgis-privacy-config",
            },
          },
        ],
      },
    ],
  };
};
