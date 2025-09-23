import { IUiSchema } from "../../core/schemas/types";
import type { IArcGISContext } from "../../types/IArcGISContext";
import { IHubPage } from "../../core/types/IHubPage";
import { getLayoutSetupUiSchemaElement } from "../../core/schemas/internal/getLayoutSetupUiSchemaElement";

/**
 * @private
 * constructs the complete edit uiSchema for Hub Pages.
 * This defines how the schema properties should be
 * rendered in the page editing experience
 */
export const buildUiSchema = (
  i18nScope: string,
  _options: Partial<IHubPage>,
  _context: IArcGISContext
  // eslint-disable-next-line @typescript-eslint/require-await
): Promise<IUiSchema> => {
  return Promise.resolve({
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
      ...getLayoutSetupUiSchemaElement(i18nScope),
    ],
  });
};
