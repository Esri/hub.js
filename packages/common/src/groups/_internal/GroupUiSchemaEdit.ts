import { IUiSchema } from "../../core/schemas/types";
import { IArcGISContext } from "../../ArcGISContext";
import { IEntityEditorOptions } from "../../core/schemas/internal/EditorOptions";

/**
 * @private
 * constructs the complete edit uiSchema for Hub Groups
 * This defines how the schema properties should be
 * rendered in the group editing experience
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
        type: "Section",
        labelKey: `${i18nScope}.sections.basicInfo.label`,
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
          {
            labelKey: `${i18nScope}.fields.summary.label`,
            scope: "/properties/summary",
            type: "Control",
            options: {
              control: "hub-field-input-input",
              type: "textarea",
            },
          },
          {
            labelKey: `${i18nScope}.fields._thumbnail.label`,
            scope: "/properties/_thumbnail",
            type: "Control",
            options: {
              control: "hub-field-input-image-picker",
              imgSrc: options.thumbnailUrl,
              maxWidth: 727,
              maxHeight: 484,
              aspectRatio: 1,
              helperText: {
                labelKey: `${i18nScope}.fields._thumbnail.helperText`,
              },
              sizeDescription: {
                labelKey: `${i18nScope}.fields._thumbnail.sizeDescription`,
              },
            },
          },
        ],
      },
    ],
  };
};
