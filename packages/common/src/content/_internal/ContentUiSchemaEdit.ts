import { IArcGISContext } from "../../ArcGISContext";
import { getTagItems } from "../../core/schemas/internal/getTagItems";
import { getCategoryItems } from "../../core/schemas/internal/getCategoryItems";
import { getLocationExtent } from "../../core/schemas/internal/getLocationExtent";
import { getLocationOptions } from "../../core/schemas/internal/getLocationOptions";
import { IHubEditableContent } from "../../core/types/IHubEditableContent";
import { IUiSchema, UiSchemaRuleEffects } from "../../core/schemas/types";
import { ALWAYS_HIDE } from "../../core/schemas/shared/rules";

/**
 * @private
 * constructs the complete edit uiSchema for Hub Content.
 * This defines how the schema properties should be
 * rendered in the content editing experience
 */
export const buildUiSchema = async (
  i18nScope: string,
  entity: IHubEditableContent,
  context: IArcGISContext
): Promise<IUiSchema> => {
  return {
    type: "Layout",
    elements: [
      {
        type: "Section",
        labelKey: `${i18nScope}.sections.basic.title`,
        elements: [
          // title
          {
            labelKey: `${i18nScope}.fields.title.label`,
            scope: "/properties/name",
            type: "Control",
            options: {
              helperText: {
                labelKey: `${i18nScope}.fields.title.hint`,
              },
              messages: [
                {
                  type: "ERROR",
                  keyword: "required",
                  icon: true,
                  labelKey: `${i18nScope}.fields.title.requiredError`,
                },
              ],
            },
          },
          // summary
          {
            labelKey: `${i18nScope}.fields.summary.label`,
            scope: "/properties/summary",
            type: "Control",
            options: {
              control: "hub-field-input-input",
              type: "textarea",
              helperText: {
                labelKey: `${i18nScope}.fields.summary.hint`,
              },
            },
          },
          // description
          {
            labelKey: `${i18nScope}.fields.description.label`,
            scope: "/properties/description",
            type: "Control",
            options: {
              control: "hub-field-input-input",
              type: "textarea",
              helperText: {
                labelKey: `${i18nScope}.fields.description.hint`,
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
          // thumbnail image
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
          // tags
          {
            labelKey: `${i18nScope}.fields.tags.label`,
            scope: "/properties/tags",
            type: "Control",
            options: {
              control: "hub-field-input-combobox",
              items: await getTagItems(
                entity,
                context.portal.id,
                context.hubRequestOptions
              ),
              allowCustomValues: true,
              selectionMode: "multiple",
              placeholderIcon: "label",
              helperText: { labelKey: `${i18nScope}.fields.tags.hint` },
            },
          },
          // categories
          {
            labelKey: `${i18nScope}.fields.categories.label`,
            scope: "/properties/categories",
            type: "Control",
            options: {
              control: "hub-field-input-combobox",
              items: await getCategoryItems(
                context.portal.id,
                context.hubRequestOptions
              ),
              allowCustomValues: false,
              selectionMode: "multiple",
              placeholderIcon: "select-category",
              helperText: {
                labelKey: `${i18nScope}.fields.categories.agolHint`, // TODO: hint should describe whether it can be set on Enterprise or Online
              },
            },
          },
          // license
          {
            labelKey: `${i18nScope}.fields.license.label`,
            scope: "/properties/licenseInfo",
            type: "Control",
            options: {
              control: "arcgis-hub-license-picker",
              helperText: {
                labelKey: `${i18nScope}.fields.license.helperText`,
              },
            },
          },
        ],
      },
      // location section
      {
        type: "Section",
        labelKey: `${i18nScope}.sections.location.label`,
        options: {
          helperText: {
            labelKey: `${i18nScope}.sections.location.helperText`,
          },
        },
        elements: [
          {
            scope: "/properties/location",
            type: "Control",
            options: {
              control: "hub-field-input-location-picker",
              extent: await getLocationExtent(
                entity,
                context.hubRequestOptions
              ),
              options: await getLocationOptions(
                entity,
                context.portal.name,
                context.hubRequestOptions
              ),
            },
          },
        ],
      },
    ],
  };
};
