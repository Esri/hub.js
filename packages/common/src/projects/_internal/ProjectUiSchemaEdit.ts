import { IArcGISContext } from "../../ArcGISContext";
import { IHubProject } from "../../core/types";
import { IUiSchema } from "../../core/schemas/types";
import { getCategoryItems } from "../../core/schemas/internal/getCategoryItems";
import { getFeaturedContentCatalogs } from "../../core/schemas/internal/getFeaturedContentCatalogs";
import { getFeaturedImageUrl } from "../../core/schemas/internal/getFeaturedImageUrl";
import { getLocationExtent } from "../../core/schemas/internal/getLocationExtent";
import { getLocationOptions } from "../../core/schemas/internal/getLocationOptions";
import { getTagItems } from "../../core/schemas/internal/getTagItems";

/**
 * @private
 * constructs the complete edit uiSchema for Hub Projects.
 * This defines how the schema properties should be
 * rendered in the project editing experience
 */
export const buildUiSchema = async (
  i18nScope: string,
  entity: IHubProject,
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
          {
            labelKey: `${i18nScope}.fields.featuredImage.label`,
            scope: "/properties/view/properties/featuredImage",
            type: "Control",
            options: {
              control: "hub-field-input-image-picker",
              imgSrc: getFeaturedImageUrl(entity, context),
              maxWidth: 727,
              maxHeight: 484,
              aspectRatio: 1,
              helperText: {
                labelKey: `${i18nScope}.fields.featuredImage.helperText`,
              },
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
        ],
      },
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
      {
        type: "Section",
        labelKey: `${i18nScope}.sections.searchDiscoverability.label`,
        elements: [
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
              helperText: { labelKey: `${i18nScope}.fields.tags.helperText` },
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
              helperText: {
                labelKey: `${i18nScope}.fields.categories.helperText`,
              },
            },
          },
          {
            labelKey: `${i18nScope}.fields._thumbnail.label`,
            scope: "/properties/_thumbnail",
            type: "Control",
            options: {
              control: "hub-field-input-image-picker",
              imgSrc: entity.thumbnailUrl,
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
      {
        type: "Section",
        labelKey: `${i18nScope}.sections.status.label`,
        elements: [
          {
            scope: "/properties/status",
            type: "Control",
            labelKey: `${i18nScope}.fields.status.label`,
            options: {
              control: "hub-field-input-select",
              enum: {
                i18nScope: `${i18nScope}.fields.status.enum`,
              },
            },
          },
        ],
      },
      {
        type: "Section",
        labelKey: `${i18nScope}.sections.timeline.label`,
        elements: [
          {
            scope: "/properties/view/properties/timeline",
            type: "Control",
            options: {
              control: "arcgis-hub-timeline-editor",
              showTitleAndDescription: false,
            },
          },
        ],
      },
      {
        type: "Section",
        labelKey: `${i18nScope}.sections.featuredContent.label`,
        options: {
          helperText: {
            labelKey: `${i18nScope}.sections.featuredContent.helperText`,
          },
        },
        elements: [
          {
            scope: "/properties/view/properties/featuredContentIds",
            type: "Control",
            options: {
              control: "hub-field-input-gallery-picker",
              targetEntity: "item",
              catalogs: getFeaturedContentCatalogs(context.currentUser),
              facets: [
                {
                  label: `{{${i18nScope}.fields.featuredContent.facets.type:translate}`,
                  key: "type",
                  display: "multi-select",
                  field: "type",
                  options: [],
                  operation: "OR",
                  aggLimit: 100,
                },
                {
                  label: `{{${i18nScope}.fields.featuredContent.facets.sharing:translate}`,
                  key: "access",
                  display: "multi-select",
                  field: "access",
                  options: [],
                  operation: "OR",
                },
              ],
            },
          },
        ],
      },
    ],
  };
};
