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
        scope: "/properties/description",
        type: "Control",
        options: {
          control: "hub-field-input-rich-text",
          type: "textarea",
          helperText: {
            labelKey: `${i18nScope}.fields.description.helperText`,
          },
        },
      },
    ],
  };
};
