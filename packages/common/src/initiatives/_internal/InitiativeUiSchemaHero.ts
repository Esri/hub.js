import { IUiSchema, UiSchemaRuleEffects } from "../../core/schemas/types";
import type { IArcGISContext } from "../../types/IArcGISContext";
import { IHubInitiative } from "../../core";
import { getAuthedImageUrl } from "../../core/_internal/getAuthedImageUrl";

/**
 * @private
 * constructs the uiSchema for editing a Hub Initiative's
 * hero inline.
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
        scope: "/properties/view/properties/hero",
        type: "Control",
        options: {
          control: "hub-field-input-tile-select",
          layout: "vertical",
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
  };
};
