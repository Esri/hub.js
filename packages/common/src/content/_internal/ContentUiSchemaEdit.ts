import { IArcGISContext } from "../../ArcGISContext";
import { getTagItems } from "../../core/schemas/internal/getTagItems";
import { getCategoryItems } from "../../core/schemas/internal/getCategoryItems";
import { getLocationExtent } from "../../core/schemas/internal/getLocationExtent";
import { getLocationOptions } from "../../core/schemas/internal/getLocationOptions";
import { IUiSchema } from "../../core/schemas/types";
import { getThumbnailUiSchemaElement } from "../../core/schemas/internal/getThumbnailUiSchemaElement";
import { IHubEditableContent } from "../../core/types";

/**
 * @private
 * constructs the complete edit uiSchema for Hub Content.
 * This defines how the schema properties should be
 * rendered in the content editing experience
 */
export const buildUiSchema = async (
  i18nScope: string,
  options: Partial<IHubEditableContent>,
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
                {
                  type: "ERROR",
                  keyword: "maxLength",
                  icon: true,
                  labelKey: `shared.fields.title.maxLengthError`,
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
              rows: 4,
              helperText: {
                labelKey: `${i18nScope}.fields.summary.hint`,
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
          // description
          {
            labelKey: `${i18nScope}.fields.description.label`,
            scope: "/properties/description",
            type: "Control",
            options: {
              control: "hub-field-input-rich-text",
              type: "textarea",
              helperText: {
                labelKey: `${i18nScope}.fields.description.hint`,
              },
            },
          },
          getThumbnailUiSchemaElement(
            i18nScope,
            options.thumbnail,
            options.thumbnailUrl
          ),
          // tags
          {
            labelKey: `${i18nScope}.fields.tags.label`,
            scope: "/properties/tags",
            type: "Control",
            options: {
              control: "hub-field-input-combobox",
              items: await getTagItems(
                options.tags,
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
              selectionMode: "ancestors",
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
                options.location,
                context.hubRequestOptions
              ),
              options: await getLocationOptions(
                options.id,
                options.type,
                options.location,
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
