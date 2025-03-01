import { IUiSchema, UiSchemaRuleEffects } from "../../core/schemas/types";
import type { IArcGISContext } from "../../types/IArcGISContext";
import { getTagItems } from "../../core/schemas/internal/getTagItems";
import { getLocationExtent } from "../../core/schemas/internal/getLocationExtent";
import { getLocationOptions } from "../../core/schemas/internal/getLocationOptions";
import { getThumbnailUiSchemaElement } from "../../core/schemas/internal/getThumbnailUiSchemaElement";
import { IHubInitiative } from "../../core";
import { getAuthedImageUrl } from "../../core/_internal/getAuthedImageUrl";
import { fetchCategoriesUiSchemaElement } from "../../core/schemas/internal/fetchCategoriesUiSchemaElement";
import { getSlugSchemaElement } from "../../core/schemas/internal/getSlugSchemaElement";

/**
 * @private
 * constructs the complete edit uiSchema for Hub Initiative.
 * This defines how the schema properties should be
 * rendered in the initiative editing experience
 */
export const buildUiSchema = async (
  i18nScope: string,
  options: Partial<IHubInitiative>,
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
            labelKey: `${i18nScope}.fields.hero.label`,
            scope: "/properties/view/properties/hero",
            type: "Control",
            options: {
              control: "hub-field-input-tile-select",
              layout: "horizontal",
              helperText: {
                labelKey: `${i18nScope}.fields.hero.helperText`,
              },
              labels: [
                `{{${i18nScope}.fields.hero.map.label:translate}}`,
                `{{${i18nScope}.fields.hero.image.label:translate}}`,
              ],
              descriptions: [
                `{{${i18nScope}.fields.hero.map.description:translate}}`,
                `{{${i18nScope}.fields.hero.image.description:translate}}`,
              ],
              icons: ["map-pin", "image"],
            },
          },
          {
            labelKey: `${i18nScope}.fields.featuredImage.label`,
            scope: "/properties/view/properties/featuredImage",
            type: "Control",
            rule: {
              effect: UiSchemaRuleEffects.HIDE,
              condition: {
                scope: "/properties/view/properties/hero",
                schema: { const: "map" },
              },
            },
            options: {
              control: "hub-field-input-image-picker",
              imgSrc: getAuthedImageUrl(
                options.view?.featuredImageUrl,
                context.requestOptions
              ),
              maxWidth: 727,
              maxHeight: 484,
              aspectRatio: 1.5,
              sizeDescription: {
                labelKey: `${i18nScope}.fields.featuredImage.sizeDescription`,
              },
              helperText: {
                labelKey: `${i18nScope}.fields.featuredImage.helperText`,
              },
            },
          },
          {
            labelKey: `${i18nScope}.fields.featuredImage.altText.label`,
            scope: "/properties/view/properties/featuredImageAltText",
            type: "Control",
            rule: {
              effect: UiSchemaRuleEffects.HIDE,
              condition: {
                scope: "/properties/view/properties/hero",
                schema: { const: "map" },
              },
            },
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
          ...(await fetchCategoriesUiSchemaElement(i18nScope, context)),
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
          ...getThumbnailUiSchemaElement(
            i18nScope,
            options.thumbnail,
            options.thumbnailUrl,
            "initiative",
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
      // Feature Content - hiding for MVP
      // {
      //   type: "Section",
      //   labelKey: `${i18nScope}.sections.featuredContent.label`,
      //   options: {
      //     helperText: {
      //       labelKey: `${i18nScope}.sections.featuredContent.helperText`,
      //     },
      //   },
      //   elements: [
      //     {
      //       scope: "/properties/view/properties/featuredContentIds",
      //       type: "Control",
      //       options: {
      //         control: "hub-field-input-gallery-picker",
      //         targetEntity: "item",
      //         catalogs: getFeaturedContentCatalogs(context.currentUser),
      //         facets: [
      //           {
      //             label: `{{${i18nScope}.fields.featuredContent.facets.type:translate}}`,
      //             key: "type",
      //             display: "multi-select",
      //             field: "type",
      //             options: [],
      //             operation: "OR",
      //             aggLimit: 100,
      //           },
      //           {
      //             label: `{{${i18nScope}.fields.featuredContent.facets.sharing:translate}}`,
      //             key: "access",
      //             display: "multi-select",
      //             field: "access",
      //             options: [],
      //             operation: "OR",
      //           },
      //         ],
      //       },
      //     },
      //   ],
      // },
    ],
  };
};
