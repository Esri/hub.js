import type { IArcGISContext } from "../../types/IArcGISContext";
import { EntityEditorOptions } from "../../core/schemas/internal/EditorOptions";
import { getThumbnailUiSchemaElement } from "../../core/schemas/internal/getThumbnailUiSchemaElement";
import { IUiSchema, UiSchemaMessageTypes } from "../../core/schemas/types";
import { getRecommendedTemplatesCatalog } from "./getRecommendedTemplatesCatalog";
import { getEntityThumbnailUrl } from "../../core/getEntityThumbnailUrl";
import { getSlugSchemaElement } from "../../core/schemas/internal/getSlugSchemaElement";
import { getTagItems } from "../../core/schemas/internal/getTagItems";
import { fetchCategoriesUiSchemaElement } from "../../core/schemas/internal/fetchCategoriesUiSchemaElement";

/**
 * @private
 * constructs the complete edit uiSchema for Hub Initiative Templates.
 * This defines how the schema properties should be rendered
 * in the initiative template editing experience.
 *
 * @param i18nScope
 * @param entity
 * @param context
 * @returns
 */
export const buildUiSchema = async (
  i18nScope: string,
  options: EntityEditorOptions,
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
                  labelKey: `shared.fields.name.maxLengthError`,
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
            getEntityThumbnailUrl(options),
            "initiativeTemplate",
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
                type: "Control",
                scope: "/properties/description",
                labelKey: `${i18nScope}.fields.description.label`,
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
          {
            type: "Control",
            scope: "/properties/recommendedTemplates",
            labelKey: `${i18nScope}.fields.recommendedTemplates.label`,
            options: {
              control: "hub-field-input-gallery-picker",
              targetEntity: "item",
              catalogs: getRecommendedTemplatesCatalog(
                context.currentUser,
                i18nScope
              ),
              facets: [
                {
                  label: `{{${i18nScope}.fields.recommendedTemplates.facets.sharing:translate}}`,
                  key: "access",
                  field: "access",
                  display: "multi-select",
                  operation: "OR",
                },
              ],
              canReorder: false,
              linkTarget: "siteRelative",
              pickerTitle: {
                labelKey: `${i18nScope}.fields.recommendedTemplates.pickerTitle`,
              },
            },
          },
        ],
      },
    ],
  };
};
