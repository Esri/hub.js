import type { IArcGISContext } from "../../types/IArcGISContext";
import { getLocationExtent } from "../../core/schemas/internal/getLocationExtent";
import { getLocationOptions } from "../../core/schemas/internal/getLocationOptions";
import { getTagItems } from "../../core/schemas/internal/getTagItems";
import { IUiSchema } from "../../core/schemas/types";
import { getThumbnailUiSchemaElement } from "../../core/schemas/internal/getThumbnailUiSchemaElement";
import { IHubSite } from "../../core/types";
import { fetchCategoriesUiSchemaElement } from "../../core/schemas/internal/fetchCategoriesUiSchemaElement";
import { getSlugSchemaElement } from "../../core/schemas/internal/getSlugSchemaElement";

/**
 * @private
 * constructs the edit uiSchema for Hub Sites.
 * This defines how the schema properties should
 * be rendered in the site editing experience
 */
export const buildUiSchema = async (
  i18nScope: string,
  options: Partial<IHubSite>,
  context: IArcGISContext
): Promise<IUiSchema> => {
  return {
    type: "Layout",
    elements: [
      // basic info section
      {
        type: "Section",
        labelKey: `${i18nScope}.sections.basicInfo.label`,
        options: {
          helperText: {
            labelKey: `${i18nScope}.sections.basicInfo.helperText`,
          },
        },
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
                  labelKey: `${i18nScope}.fields.name.siteEntityTitleValidatorError`,
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
                  labelKey: `shared.fields.summary.maxLengthError`,
                },
              ],
            },
          },
          ...getThumbnailUiSchemaElement(
            i18nScope,
            options.thumbnail,
            options.thumbnailUrl,
            "site",
            context.requestOptions
          ),
          ...(context.isPortal ? [getSlugSchemaElement(i18nScope)] : []),
          {
            type: "Section",
            labelKey: `${i18nScope}.sections.description.label`,
            options: {
              section: "block",
            },
            elements: [
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
              ...(await fetchCategoriesUiSchemaElement({
                source: "org",
                currentValues: options.categories,
                context,
              })),
            ],
          },
        ],
      },
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
