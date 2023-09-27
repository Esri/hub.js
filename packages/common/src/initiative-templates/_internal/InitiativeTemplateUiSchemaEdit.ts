import { IArcGISContext } from "../..";
import { IHubInitiativeTemplate } from "../../core";
import { IUiSchema, UiSchemaMessageTypes } from "../../core/schemas/types";

/**
 * @private
 * constructs the complete edit uiSchema for Hub Initiative Templates.
 * This defines how the schema properties should be rendered
 * in the initiative template editing experience.
 *
 * @param i18nScope
 * @param entity
 * @param context
 * @returns
 */
export const buildUiSchema = async (
  i18nScope: string,
  entity: IHubInitiativeTemplate,
  context: IArcGISContext
): Promise<IUiSchema> => {
  return {
    type: "Layout",
    elements: [
      {
        type: "Control",
        scope: "/properties/name",
        labelKey: `${i18nScope}.fields.name.label`,
        options: {
          messages: [
            {
              type: UiSchemaMessageTypes.error,
              keyword: "required",
              icon: true,
              labelKey: `${i18nScope}.fields.name.requiredError`,
            },
          ],
        },
      },
      {
        type: "Control",
        scope: "/properties/previewUrl",
        labelKey: `${i18nScope}.fields.previewUrl.label`,
      },
      {
        type: "Control",
        scope: "/properties/summary",
        labelKey: `${i18nScope}.fields.summary.label`,
      },
      {
        type: "Control",
        scope: "/properties/description",
        labelKey: `${i18nScope}.fields.description.label`,
      },
      {
        type: "Control",
        scope: "/properties/_thumbnail",
        labelKey: `${i18nScope}.fields._thumbnail.label`,
      },
    ],
  };
};
