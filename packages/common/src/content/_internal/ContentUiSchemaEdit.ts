import type { IArcGISContext } from "../../types/IArcGISContext";
import { getTagItems } from "../../core/schemas/internal/getTagItems";
import { getLocationExtent } from "../../core/schemas/internal/getLocationExtent";
import { getLocationOptions } from "../../core/schemas/internal/getLocationOptions";
import { IUiSchema } from "../../core/schemas/types";
import { getThumbnailUiSchemaElement } from "../../core/schemas/internal/getThumbnailUiSchemaElement";
import { IHubEditableContent } from "../../core/types";
import { fetchCategoriesUiSchemaElement } from "../../core/schemas/internal/fetchCategoriesUiSchemaElement";
import { getSlugSchemaElement } from "../../core/schemas/internal/getSlugSchemaElement";

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
        options: {
          helperText: {
            labelKey: `${i18nScope}.sections.basic.helperText`,
          },
        },
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
          ...getThumbnailUiSchemaElement(
            i18nScope,
            options.thumbnail,
            options.thumbnailUrl,
            "content",
            context.requestOptions
          ),
          getSlugSchemaElement(i18nScope),
          {
            type: "Section",
            labelKey: `${i18nScope}.sections.description.label`,
            options: {
              section: "block",
              helperText: {
                labelKey: `${i18nScope}.sections.description.helperText`,
              },
            },
            elements: [
              // description
              {
                labelKey: `${i18nScope}.fields.description.label`,
                scope: "/properties/description",
                type: "Control",
                options: {
                  control: "hub-field-input-rich-text",
                  type: "textarea",
                },
              },
            ],
          },
          {
            type: "Section",
            labelKey: `${i18nScope}.sections.discoverability.label`,
            options: {
              section: "block",
              helperText: {
                labelKey: `${i18nScope}.sections.discoverability.helperText`,
              },
            },
            elements: [
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
                },
              },
              // categories
              ...(await fetchCategoriesUiSchemaElement(i18nScope, context)),
            ],
          },
          // {
          //   labelKey: `${i18nScope}.fields.license.label`,
          //   scope: "/properties/licenseInfo",
          //   type: "Control",
          //   options: {
          //     control: "arcgis-hub-license-picker",
          //   },
          // },
          // license
          {
            labelKey: `${i18nScope}.fields.license.label`,
            scope: "/properties/licenseInfo",
            type: "Control",
            options: {
              control: "arcgis-hub-license-picker",
            },
          },
        ],
      },
      // location section
      {
        type: "Section",
        labelKey: `${i18nScope}.sections.location.label`,
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
              noticeTitleElementAriaLevel: 3,
            },
          },
        ],
      },
    ],
  };
};
