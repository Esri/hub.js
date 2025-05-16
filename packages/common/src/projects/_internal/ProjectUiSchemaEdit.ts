import type { IArcGISContext } from "../../types/IArcGISContext";
import { IUiSchema } from "../../core/schemas/types";
import { getFeaturedContentCatalogs } from "../../core/schemas/internal/getFeaturedContentCatalogs";
import { getLocationExtent } from "../../core/schemas/internal/getLocationExtent";
import { getLocationOptions } from "../../core/schemas/internal/getLocationOptions";
import { getTagItems } from "../../core/schemas/internal/getTagItems";
import { getThumbnailUiSchemaElement } from "../../core/schemas/internal/getThumbnailUiSchemaElement";
import { IHubProject } from "../../core/types";
import { getAuthedImageUrl } from "../../core/_internal/getAuthedImageUrl";
import { fetchCategoriesUiSchemaElement } from "../../core/schemas/internal/fetchCategoriesUiSchemaElement";
import { getSlugSchemaElement } from "../../core/schemas/internal/getSlugSchemaElement";

/**
 * @private
 * constructs the complete edit uiSchema for Hub Projects.
 * This defines how the schema properties should be
 * rendered in the project editing experience
 */
export const buildUiSchema = async (
  i18nScope: string,
  options: Partial<IHubProject>,
  context: IArcGISContext
): Promise<IUiSchema> => {
  return {
    type: "Layout",
    elements: [
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
              helperText: {
                labelKey: `${i18nScope}.fields.summary.helperText`,
              },
              messages: [
                {
                  type: "ERROR",
                  keyword: "maxLength",
                  icon: true,
                  labelKey: `shared.fields.purpose.maxLengthError`,
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
              imgSrc: getAuthedImageUrl(
                options.view?.featuredImageUrl,
                context.requestOptions
              ),
              maxWidth: 727,
              maxHeight: 484,
              aspectRatio: 1.5,
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
      {
        type: "Section",
        labelKey: `${i18nScope}.sections.searchDiscoverability.label`,
        elements: [
          getSlugSchemaElement(i18nScope),
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
              helperText: { labelKey: `${i18nScope}.fields.tags.helperText` },
            },
          },
          ...(await fetchCategoriesUiSchemaElement(i18nScope, context)),
          ...getThumbnailUiSchemaElement(
            i18nScope,
            options.thumbnail,
            options.thumbnailUrl,
            "project",
            context.requestOptions
          ),
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
                  label: `{{${i18nScope}.fields.featuredContent.facets.type:translate}}`,
                  key: "type",
                  display: "multi-select",
                  field: "type",
                  options: [],
                  operation: "OR",
                  aggLimit: 100,
                },
                {
                  label: `{{${i18nScope}.fields.featuredContent.facets.sharing:translate}}`,
                  key: "access",
                  display: "multi-select",
                  field: "access",
                  options: [],
                  operation: "OR",
                },
              ],
              showAllCollectionFacet: true,
              showAddContent: true,
            },
          },
        ],
      },
      {
        type: "Section",
        labelKey: `${i18nScope}.sections.callToAction.label`,
        options: {
          helperText: {
            labelKey: `${i18nScope}.sections.callToAction.helperText`,
          },
        },
        elements: [
          {
            scope: "/properties/view/properties/heroActions",
            type: "Control",
            options: {
              control: "hub-composite-input-action-links",
              type: "button",
              catalogs: getFeaturedContentCatalogs(context.currentUser), // for now we'll just re-use this util to get the catalogs
              facets: [
                {
                  label: `{{${i18nScope}.fields.callToAction.facets.type:translate}}`,
                  key: "type",
                  display: "multi-select",
                  field: "type",
                  options: [],
                  operation: "OR",
                  aggLimit: 100,
                },
                {
                  label: `{{${i18nScope}.fields.callToAction.facets.sharing:translate}}`,
                  key: "access",
                  display: "multi-select",
                  field: "access",
                  options: [],
                  operation: "OR",
                },
              ],
              showAllCollectionFacet: true,
            },
          },
        ],
      },
      {
        type: "Section",
        labelKey: `${i18nScope}.sections.embeds.label`,
        options: {
          headerTag: "h2",
          helperText: { labelKey: `${i18nScope}.sections.embeds.helperText` },
        },
        elements: [
          {
            scope: "/properties/view/properties/embeds",
            type: "Control",
            options: {
              control: "hub-composite-input-embeds",
            },
          },
        ],
      },
    ],
  };
};
