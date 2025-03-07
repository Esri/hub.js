import { IUiSchema } from "../../core/schemas/types";
import type { IArcGISContext } from "../../types/IArcGISContext";
import { IHubInitiative } from "../../core";

/**
 * @private
 * constructs the uiSchema for editing a Hub Initiative's
 * hero inline.
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
        scope: "/properties/view/properties/hero",
        type: "Control",
        options: {
          control: "hub-field-input-tile-select",
          layout: "vertical",
          helperText: {
            labelKey: `${i18nScope}.fields.hero.helperText`,
          },
          labels: [
            `{{${i18nScope}.fields.hero.map.label:translate}}`,
            `{{${i18nScope}.fields.hero.image.label:translate}}`,
          ],
          descriptions: [
            `{{${i18nScope}.fields.hero.map.description:translate}}`,
            `{{${i18nScope}.fields.hero.image.description:translate}}`,
          ],
          icons: ["map-pin", "image"],
        },
      },
    ],
  };
};
