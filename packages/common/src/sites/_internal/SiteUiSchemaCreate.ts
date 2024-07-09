import { IArcGISContext } from "../../ArcGISContext";
import { IUiSchema } from "../../core/schemas/types";
import { IHubSite } from "../../core/types";

/**
 * @private
 * constructs the minimal create uiSchema for Hub Sites.
 * This defines how the schema properties should be rendered
 * in the site creation experience
 *
 * TODO: this was copied from projects and is just a placeholder
 * for now - it isn't being used anywhere in the application
 */
export const buildUiSchema = async (
  i18nScope: string,
  options: Partial<IHubSite>,
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
          ],
        },
      },
    ],
  };
};
