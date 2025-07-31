import type { IArcGISContext } from "../../types/IArcGISContext";
import { IUiSchema } from "../../core/schemas/types";
import { IHubProject } from "../../core/types";
import { buildCatalogSetupUiSchemaElement } from "../../core/schemas/internal/buildCatalogSetupUiSchemaElement";

/**
 * @private
 * constructs the minimal create uiSchema for Hub Projects.
 * This defines how the schema properties should be rendered
 * in the project creation experience
 */
export const buildUiSchema = async (
  i18nScope: string,
  _options: Partial<IHubProject>,
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
      ...buildCatalogSetupUiSchemaElement(i18nScope, context),
    ],
  };
};
