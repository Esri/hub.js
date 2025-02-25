import { IUiSchema } from "../../core/schemas/types";
import type { IArcGISContext } from "../../IArcGISContext";
import { EntityEditorOptions } from "../../core/schemas/internal/EditorOptions";
import { getEntityThumbnailUrl } from "../../core/getEntityThumbnailUrl";
import { getThumbnailUiSchemaElement } from "../../core/schemas/internal/getThumbnailUiSchemaElement";

/**
 * @private
 * constructs the complete edit uiSchema for Hub Groups
 * This defines how the schema properties should be
 * rendered in the group editing experience
 */
export const buildUiSchema = async (
  i18nScope: string,
  options: EntityEditorOptions,
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
          {
            labelKey: `${i18nScope}.fields.summary.label`,
            scope: "/properties/summary",
            type: "Control",
            options: {
              control: "hub-field-input-input",
              type: "textarea",
              rows: 4,
              messages: [
                {
                  type: "ERROR",
                  keyword: "maxLength",
                  icon: true,
                  labelKey: `${i18nScope}.fields.summary.maxLengthError`,
                },
              ],
            },
          },
          {
            labelKey: `${i18nScope}.fields.description.label`,
            scope: "/properties/description",
            type: "Control",
            options: {
              control: "hub-field-input-rich-text",
              type: "textarea",
            },
          },
          ...getThumbnailUiSchemaElement(
            i18nScope,
            options.thumbnail,
            getEntityThumbnailUrl(options),
            "group",
            context.requestOptions
          ),
        ],
      },
    ],
  };
};
