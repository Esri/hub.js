import type { IArcGISContext } from "../../types/IArcGISContext";
import { IUiSchema } from "../../core/schemas/types";
import { EntityEditorOptions } from "../../core/schemas/internal/EditorOptions";
import { IHubSite } from "../../core/types/IHubSite";

/**
 * @private
 * constructs the edit uiSchema for Hub Sites.
 * This defines how the schema properties should
 * be rendered in the site editing experience
 */
export const buildUiSchema = (
  i18nScope: string,
  options: EntityEditorOptions,
  context: IArcGISContext
): Promise<IUiSchema> => {
  // NOTE: if this is not defined on the site then
  // the component will use the authenticated user's org
  // which may not be the same as the site's org
  const orgUrlKey = (options as IHubSite).orgUrlKey;
  const result: IUiSchema = {
    type: "Layout",
    elements: [
      {
        type: "Section",
        labelKey: `${i18nScope}.sections.siteUrl.label`,
        options: {
          requiredHelperText: {
            labelKey: `${i18nScope}.sections.defaultRequiredHelperText`,
          },
        },
        elements: [
          {
            scope: "/properties/_urlInfo",
            type: "Control",
            options: {
              type: "Control",
              control: "hub-composite-input-site-url",
              orgUrlKey,
              messages: [
                {
                  type: "ERROR",
                  keyword: "isUniqueDomain",
                  labelKey: `${i18nScope}.fields.siteUrl.isUniqueError`,
                  icon: true,
                },
              ],
            },
          },
        ],
      },
    ],
  };

  // Only Add this is it's not an enterprise environment
  // This is better than using a condition, as that is applied after
  // the UI renders, but and sometimes we get a flash of the privacy section
  if (!context.isPortal) {
    result.elements.push({
      type: "Section",
      labelKey: `${i18nScope}.sections.privacy.label`,

      elements: [
        {
          scope: "/properties/telemetry/properties/consentNotice",
          type: "Control",
          options: {
            control: "arcgis-privacy-config",
          },
        },
      ],
    });
  }

  return Promise.resolve(result);
};
