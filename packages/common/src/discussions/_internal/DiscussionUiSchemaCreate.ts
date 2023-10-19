import { IUiSchema } from "../../core";
import { IArcGISContext } from "../../ArcGISContext";
import { IEntityEditorOptions } from "../../core/schemas/internal/EditorOptions";
/**
 * @private
 * constructs the complete create uiSchema for Hub Discussions.
 * This defines how the schema properties should be
 * rendered in the discussion creation experience
 */
export const buildUiSchema = async (
  i18nScope: string,
  options: IEntityEditorOptions,
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
          ],
        },
      },
    ],
  };
};
