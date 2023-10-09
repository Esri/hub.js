import { IArcGISContext } from "../..";
import { IHubInitiativeTemplate } from "../../core";
import { ALWAYS_HIDE } from "../../core/schemas/shared/rules";
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
        type: "Control",
        scope: "/properties/summary",
        labelKey: `${i18nScope}.fields.summary.label`,
        options: {
          control: "hub-field-input-input",
          type: "textarea",
        },
      },
      {
        type: "Control",
        scope: "/properties/description",
        labelKey: `${i18nScope}.fields.description.label`,
        options: {
          control: "hub-field-input-input",
          type: "textarea",
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
      {
        type: "Control",
        scope: "/properties/_thumbnail",
        labelKey: `${i18nScope}.fields._thumbnail.label`,
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
  };
};
