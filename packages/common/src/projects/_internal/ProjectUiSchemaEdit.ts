import type { IArcGISContext } from "../../types/IArcGISContext";
import { IUiSchema } from "../../core/schemas/types";
import { getLocationExtent } from "../../core/schemas/internal/getLocationExtent";
import { getLocationOptions } from "../../core/schemas/internal/getLocationOptions";
import { getTagItems } from "../../core/schemas/internal/getTagItems";
import { getThumbnailUiSchemaElement } from "../../core/schemas/internal/getThumbnailUiSchemaElement";
import { IHubProject } from "../../core/types";
import { getAuthedImageUrl } from "../../core/_internal/getAuthedImageUrl";
import { fetchCategoriesUiSchemaElement } from "../../core/schemas/internal/fetchCategoriesUiSchemaElement";
import { getFeaturedContentCatalogs } from "../../core/schemas/internal/getFeaturedContentCatalogs";

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
          // getSlugSchemaElement(i18nScope),
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
                  labelKey: `shared.fields.purpose.maxLengthError`,
                },
              ],
            },
          },
          ...getThumbnailUiSchemaElement(
            i18nScope,
            options.thumbnail,
            options.thumbnailUrl,
            "project",
            context.requestOptions
          ),
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
          {
            type: "Section",
            labelKey: `${i18nScope}.sections.timeline.label`,
            options: {
              section: "block",
              helperText: {
                labelKey: `${i18nScope}.sections.timeline.helperText`,
              },
            },
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
        ],
      },
      {
        type: "Section",
        labelKey: "shared.sections.heroBanner.label",
        elements: [
          // {
          //   type: "Section",
          //   labelKey: 'shared.sections.heroBannerAppearance.label',
          //   options: {
          //     section: "block",
          //     helperText: {
          //       labelKey: 'shared.sections.heroBannerAppearance.helperText',
          //     },
          //   },
          //   elements: [
          //     {
          //       labelKey: 'shared.fields.hero.label',
          //       scope: "/properties/view/properties/hero",
          //       type: "Control",
          //       options: {
          //         control: "hub-field-input-tile-select",
          //         layout: "horizontal",
          //         labels: [
          //           '{{shared.fields.hero.map.label:translate}}',
          //           '{{shared.fields.hero.image.label:translate}}',
          //         ],
          //         descriptions: [
          //           '{{shared.fields.hero.map.description:translate}}',
          //           '{{shared.fields.hero.image.description:translate}}',
          //         ],
          //         icons: ["map-pin", "image"],
          //       },
          //     },
          //     {
          //       labelKey: 'shared.fields.featuredImage.altText.label',
          //       scope: "/properties/view/properties/featuredImageAltText",
          //       type: "Control",
          //       rule: {
          //         effect: UiSchemaRuleEffects.HIDE,
          //         condition: {
          //           scope: "/properties/view/properties/hero",
          //           schema: { const: "map" },
          //         },
          //       },
          //     },
          //   ]
          // },
          {
            type: "Section",
            labelKey: "shared.sections.heroActions.label",
            options: {
              section: "block",
              helperText: {
                labelKey: "shared.sections.heroActions.helperText",
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
        ],
      },
      {
        type: "Section",
        labelKey: `${i18nScope}.sections.view.label`,
        elements: [
          {
            type: "Section",
            labelKey: `${i18nScope}.sections.view.image.label`,
            options: {
              section: "block",
              helperText: {
                labelKey: `${i18nScope}.sections.view.image.helperText`,
              },
            },
            elements: [
              {
                labelKey: "shared.fields.featuredImage.label",
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
                  sizeDescription: {
                    labelKey: "shared.fields.featuredImage.sizeDescription",
                  },
                },
              },
              {
                labelKey: "shared.fields.featuredImage.altText.label",
                scope: "/properties/view/properties/featuredImageAltText",
                type: "Control",
              },
            ],
          },
          {
            type: "Section",
            labelKey: `${i18nScope}.sections.view.embed.label`,
            options: {
              section: "block",
              helperText: {
                labelKey: `${i18nScope}.sections.view.embed.helperText`,
              },
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
          {
            type: "Section",
            labelKey: `${i18nScope}.sections.view.content.label`,
            options: {
              section: "block",
              helperText: {
                labelKey: `${i18nScope}.sections.view.content.helperText`,
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
        ],
      },
    ],
  };
};
