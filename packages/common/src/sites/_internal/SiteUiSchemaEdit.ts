import { IArcGISContext } from "../../ArcGISContext";
import { getCategoryItems } from "../../core/schemas/internal/getCategoryItems";
import { getLocationExtent } from "../../core/schemas/internal/getLocationExtent";
import { getLocationOptions } from "../../core/schemas/internal/getLocationOptions";
import { getTagItems } from "../../core/schemas/internal/getTagItems";
import { IUiSchema } from "../../core/schemas/types";
import { IHubSite } from "../../core/types";

/**
 * @private
 * construct edit uiSchema for Hub Projects - this defines
 * how the schema properties should be rendered in the
 * project editing experience
 */
export const buildUiSchema = async (
  i18nScope: string,
  entity: IHubSite,
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
            },
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
    ],
  };
};
