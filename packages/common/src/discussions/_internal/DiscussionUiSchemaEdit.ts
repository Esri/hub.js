import { IUiSchema } from "../../core/schemas/types";
import { IArcGISContext } from "../../ArcGISContext";
import { IHubDiscussion } from "../../core/types";
import { getFeaturedImageUrl } from "../../core/schemas/internal/getFeaturedImageUrl";
import { getTagItems } from "../../core/schemas/internal/getTagItems";
import { getCategoryItems } from "../../core/schemas/internal/getCategoryItems";
import { getLocationExtent } from "../../core/schemas/internal/getLocationExtent";
import { getLocationOptions } from "../../core/schemas/internal/getLocationOptions";
import { getThumbnailUiSchemaElement } from "../../core/schemas/internal/getThumbnailUiSchemaElement";

/**
 * @private
 * constructs the complete edit uiSchema for Hub Discussions.
 * This defines how the schema properties should be
 * rendered in the discussion editing experience
 */
export const buildUiSchema = async (
  i18nScope: string,
  entity: IHubDiscussion,
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
            labelKey: `${i18nScope}.fields.prompt.label`,
            scope: "/properties/prompt",
            type: "Control",
            options: {
              helperText: {
                labelKey: `${i18nScope}.fields.prompt.helperText`,
              },
              messages: [
                {
                  type: "ERROR",
                  keyword: "required",
                  icon: true,
                  labelKey: `${i18nScope}.fields.prompt.requiredError`,
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
          getThumbnailUiSchemaElement(i18nScope, entity),
          {
            labelKey: `${i18nScope}.fields.featuredImage.label`,
            scope: "/properties/view/properties/featuredImage",
            type: "Control",
            options: {
              control: "hub-field-input-image-picker",
              imgSrc: getFeaturedImageUrl(entity, context),
              maxWidth: 727,
              maxHeight: 484,
              aspectRatio: 1.5,
              sizeDescription: {
                labelKey: `${i18nScope}.fields.featuredImage.sizeDescription`,
              },
            },
          },
          {
            labelKey: `${i18nScope}.fields.featuredImage.altText.label`,
            scope: "/properties/view/properties/featuredImageAltText",
            type: "Control",
            options: {
              helperText: {
                labelKey: `${i18nScope}.fields.featuredImage.altText.helperText`,
              },
            },
          },
          {
            labelKey: `${i18nScope}.fields.featuredImage.name.label`,
            scope: "/properties/view/properties/featuredImageName",
            type: "Control",
          },
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
            },
          },
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
            },
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
