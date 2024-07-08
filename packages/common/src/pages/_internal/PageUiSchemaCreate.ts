import { IUiSchema } from "../../core/schemas/types";
import { IArcGISContext } from "../../ArcGISContext";
import { getTagItems } from "../../core/schemas/internal/getTagItems";
import { getCategoryItems } from "../../core/schemas/internal/getCategoryItems";
import { getLocationExtent } from "../../core/schemas/internal/getLocationExtent";
import { getLocationOptions } from "../../core/schemas/internal/getLocationOptions";
import { getThumbnailUiSchemaElement } from "../../core/schemas/internal/getThumbnailUiSchemaElement";
import { IHubPage } from "../../core/types";

/**
 * @private
 * constructs the complete edit uiSchema for Hub Pages.
 * This defines how the schema properties should be
 * rendered in the page editing experience
 */
export const buildUiSchema = async (
  i18nScope: string,
  options: Partial<IHubPage>,
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
      {
        labelKey: `${i18nScope}.fields.summary.label`,
        scope: "/properties/summary",
        type: "Control",
        options: {
          control: "hub-field-input-input",
          type: "textarea",
          rows: 4,
          helperText: {
            labelKey: `${i18nScope}.fields.summary.helperText`,
          },
          messages: [
            {
              type: "ERROR",
              keyword: "maxLength",
              icon: true,
              labelKey: `shared.fields.summary.maxLengthError`,
            },
          ],
        },
      },
    ],
  };
};
