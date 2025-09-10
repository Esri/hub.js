import { IUiSchema } from "../../core/schemas/types";
// import type { IArcGISContext } from "../../types/IArcGISContext";
import { IHubPage } from "../../core/types";
import { getLayoutSetupUiSchemaElement } from "../../core/schemas/internal/getLayoutSetupUiSchemaElement";

/**
 * @private
 * constructs the complete edit uiSchema for Hub Pages.
 * This defines how the schema properties should be
 * rendered in the page editing experience
 */
export const buildUiSchema = async (
  i18nScope: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options: Partial<IHubPage>
  // context: IArcGISContext
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
      ...getLayoutSetupUiSchemaElement(),
    ],
  };
};
