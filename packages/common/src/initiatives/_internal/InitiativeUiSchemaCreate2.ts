import type { IArcGISContext } from "../../types/IArcGISContext";
import { IUiSchema } from "../../core/schemas/types";
import { IHubInitiative } from "../../core/types";

/**
 * @private
 * constructs the minimal create uiSchema for Hub Initiatives.
 * This defines how the schema properties should be rendered
 * in the initiative creation experience
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
        labelKey: `${i18nScope}.fields.name.label`,
        scope: "/properties/name",
        type: "Control",
        options: {
          messages: [
            {
              type: "ERROR",
              keyword: "required",
              icon: true,
              labelKey: `${i18nScope}.fields.name.requiredError`,
            },
            {
              type: "ERROR",
              keyword: "maxLength",
              icon: true,
              labelKey: `${i18nScope}.fields.name.maxLengthError`,
            },
            {
              type: "ERROR",
              keyword: "format",
              icon: true,
              labelKey: `${i18nScope}.fields.name.entityTitleValidatorError`,
            },
          ],
        },
      },
    ],
  };
};
