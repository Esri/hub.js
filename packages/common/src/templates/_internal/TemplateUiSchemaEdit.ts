import { IArcGISContext } from "../../ArcGISContext";
import { ALWAYS_HIDE } from "../../core/schemas/shared/rules";
import { IUiSchema, UiSchemaMessageTypes } from "../../core/schemas/types";
import { IHubTemplate } from "../../core/types/IHubTemplate";

/**
 * @private
 * constructs the complete edit uiSchema for Hub Templates.
 * This defines how the schema properties should be rendered
 * in the template editing experience.
 *
 * @param i18nScope
 * @param entity
 * @param context
 * @returns
 */
export const buildUiSchema = async (
  i18nScope: string,
  entity: IHubTemplate,
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
            options: {
              helperText: {
                labelKey: `${i18nScope}.fields.previewUrl.helperText`,
              },
              messages: [
                {
                  type: "ERROR",
                  keyword: "if",
                  hidden: true,
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
              helperText: {
                labelKey: `${i18nScope}.fields.summary.helperText`,
              },
            },
          },
          {
            labelKey: `${i18nScope}.fields.description.label`,
            scope: "/properties/description",
            type: "Control",
            options: {
              control: "hub-field-input-input",
              type: "textarea",
              helperText: {
                labelKey: `${i18nScope}.fields.description.helperText`,
              },
            },
          },
          // HIDDEN, READ-ONLY CONTROLS FOR VALIDATION RULES
          // Unless we include a UI control, the Entity Editor will rip these values
          // out of the underlying schema and cause validation errors on load.
          {
            scope: "/properties/type",
            type: "Control",
            rule: ALWAYS_HIDE,
          },
          {
            scope: "/properties/thumbnail",
            type: "Control",
            rule: ALWAYS_HIDE,
          },
          // Actual control for modifying the thumbnail
          {
            labelKey: `${i18nScope}.fields._thumbnail.label`,
            scope: "/properties/_thumbnail",
            type: "Control",
            options: {
              control: "hub-field-input-image-picker",
              imgSrc: entity.thumbnailUrl,
              maxWidth: 727,
              maxHeight: 484,
              aspectRatio: 1.5,
              helperText: {
                labelKey: `${i18nScope}.fields._thumbnail.helperText`,
              },
              sizeDescription: {
                labelKey: `${i18nScope}.fields._thumbnail.sizeDescription`,
              },
              messages: [
                {
                  type: "CUSTOM",
                  display: "notice",
                  labelKey: `${i18nScope}.fields._thumbnail.defaultThumbnailNotice`,
                  icon: "lightbulb",
                  allowShowBeforeInteract: true,
                  condition: {
                    schema: {
                      properties: {
                        // There are actually 2 default thumbnail values from AGO. They are:
                        // - No thumbnail at all (usually temporary)
                        // - An auto-generated thumbnail showcasing geometry (always named `ago_downloaded.png`)
                        thumbnail: {
                          oneOf: [
                            { type: "null" },
                            {
                              type: "string",
                              enum: ["thumbnail/ago_downloaded.png"],
                            },
                          ],
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    ],
  };
};
