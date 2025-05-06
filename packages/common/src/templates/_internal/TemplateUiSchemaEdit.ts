import type { IArcGISContext } from "../../types/IArcGISContext";
import { getThumbnailUiSchemaElement } from "../../core/schemas/internal/getThumbnailUiSchemaElement";
import { IUiSchema, UiSchemaMessageTypes } from "../../core/schemas/types";
import { getEntityThumbnailUrl } from "../../core/getEntityThumbnailUrl";
import { getSlugSchemaElement } from "../../core/schemas/internal/getSlugSchemaElement";
import { getTagItems } from "../../core/schemas/internal/getTagItems";
import { fetchCategoriesUiSchemaElement } from "../../core/schemas/internal/fetchCategoriesUiSchemaElement";
import { HubEntity, IHubTemplate } from "../../core";
import { getFeaturedContentCatalogs } from "../../core/schemas/internal/getFeaturedContentCatalogs";

/**
 * @private
 * constructs the complete edit uiSchema for Hub Templates.
 * This defines how the schema properties should be rendered
 * in the template editing experience.
 *
 * @param i18nScope
 * @param entity
 * @param context
 * @returns
 */
export const buildUiSchema = async (
  i18nScope: string,
  options: Partial<IHubTemplate>,
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
          getSlugSchemaElement(i18nScope),
          {
            type: "Control",
            scope: "/properties/summary",
            labelKey: `${i18nScope}.fields.summary.label`,
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
            getEntityThumbnailUrl(options as HubEntity),
            "template",
            context.requestOptions
          ),
          {
            type: "Section",
            labelKey: `${i18nScope}.sections.description.label`,
            options: {
              section: "block",
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
        ],
      },
      {
        type: "Section",
        labelKey: `${i18nScope}.sections.templateDetails.label`,
        elements: [
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
                  keyword: "format",
                  icon: true,
                  labelKey: `shared.errors.urlFormat`,
                },
                {
                  type: "ERROR",
                  keyword: "if",
                  hidden: true,
                },
              ],
            },
          },
        ],
      },
      // NOTE: this does not round-trip....
      // {
      //   type: "Section",
      //   labelKey: `${i18nScope}.sections.location.label`,
      //   elements: [
      //     {
      //       scope: "/properties/location",
      //       type: "Control",
      //       options: {
      //         control: "hub-field-input-location-picker",
      //         extent: await getLocationExtent(
      //           options.location,
      //           context.hubRequestOptions
      //         ),
      //         options: await getLocationOptions(
      //           options.id,
      //           options.type,
      //           options.location,
      //           context.portal.name,
      //           context.hubRequestOptions
      //         ),
      //         noticeTitleElementAriaLevel: 3,
      //       },
      //     },
      //   ],
      // },
      {
        type: "Section",
        labelKey: "shared.sections.heroBanner.label",
        elements: [
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
                      label: "shared.fields.callToAction.facets.type",
                      key: "type",
                      display: "multi-select",
                      field: "type",
                      options: [],
                      operation: "OR",
                      aggLimit: 100,
                    },
                    {
                      label: "shared.fields.callToAction.facets.sharing",
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
    ],
  };
};
