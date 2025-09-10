import type { IArcGISContext } from "../../types/IArcGISContext";
import { IUiSchema } from "../../core/schemas/types";
import { IHubSite } from "../../core/types";
import { buildCatalogSetupUiSchemaElement } from "../../core/schemas/internal/buildCatalogSetupUiSchemaElement";
import { getLayoutSetupUiSchemaElement } from "../../core/schemas/internal/getLayoutSetupUiSchemaElement";

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
  // NOTE: if this is not defined on the site then
  // the component will use the authenticated user's org
  // which may not be the same as the site's org
  const orgUrlKey = (options as IHubSite).orgUrlKey;
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
              labelKey: `${i18nScope}.fields.name.siteEntityTitleValidatorError`,
            },
          ],
        },
      },
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
      ...buildCatalogSetupUiSchemaElement(i18nScope, context),
      ...getLayoutSetupUiSchemaElement(),
    ],
  };
};
