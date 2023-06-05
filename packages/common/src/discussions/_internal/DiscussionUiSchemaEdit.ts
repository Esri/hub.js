import { IUiSchema } from "../../core";

/**
 * complete edit uiSchema for Hub discussions - this defines
 * how the schema properties should be rendered in the
 * discussion editing experience
 */
export const uiSchema: IUiSchema = {
  type: "Layout",
  elements: [
    {
      type: "Section",
      labelKey: "{{i18nScope}}.sections.basicInfo.label",
      elements: [
        {
          labelKey: "{{i18nScope}}.fields.title.label",
          scope: "/properties/title",
          type: "Control",
          options: {
            messages: [
              {
                type: "ERROR",
                keyword: "required",
                icon: true,
                labelKey: "{{i18nScope}}.fields.title.requiredError",
              },
            ],
          },
        },
        {
          labelKey: "{{i18nScope}}.fields.prompt.label",
          scope: "/properties/prompt",
          type: "Control",
          options: {
            helperText: {
              labelKey: "{{i18nScope}}.fields.prompt.helperText",
            },
            messages: [
              {
                type: "ERROR",
                keyword: "required",
                icon: true,
                labelKey: "{{i18nScope}}.fields.prompt.requiredError",
              },
            ],
          },
        },
        {
          labelKey: "{{i18nScope}}.fields.summary.label",
          scope: "/properties/summary",
          type: "Control",
          options: {
            control: "hub-field-input-input",
            type: "textarea",
            helperText: {
              labelKey: "{{i18nScope}}.fields.summary.helperText",
            },
          },
        },
        {
          labelKey: "{{i18nScope}}.fields.description.label",
          scope: "/properties/description",
          type: "Control",
          options: {
            control: "hub-field-input-input",
            type: "textarea",
            helperText: {
              labelKey: "{{i18nScope}}.fields.description.helperText",
            },
          },
        },
        {
          labelKey: "{{i18nScope}}.fields.featuredImage.label",
          scope: "/properties/view/properties/featuredImage",
          type: "Control",
          options: {
            control: "hub-field-input-image-picker",
            maxWidth: 727,
            maxHeight: 484,
            aspectRatio: 1.5,
            sizeDescription: {
              labelKey: "{{i18nScope}}.fields.featuredImage.sizeDescription",
            },
          },
        },
        {
          labelKey: "{{i18nScope}}.fields.featuredImage.altText.label",
          scope: "/properties/view/properties/featuredImageAltText",
          type: "Control",
          options: {
            helperText: {
              labelKey: "{{i18nScope}}.fields.featuredImage.altText.helperText",
            },
          },
        },
        {
          labelKey: "{{i18nScope}}.fields.featuredImage.name.label",
          scope: "/properties/view/properties/featuredImageName",
          type: "Control",
        },
        {
          labelKey: "{{i18nScope}}.fields.tags.label",
          scope: "/properties/tags",
          type: "Control",
          options: {
            control: "hub-field-input-combobox",
            allowCustomValues: true,
            selectionMode: "multiple",
            placeholderIcon: "label",
          },
        },
        {
          labelKey: "{{i18nScope}}.fields.categories.label",
          scope: "/properties/categories",
          type: "Control",
          options: {
            control: "hub-field-input-combobox",
            allowCustomValues: false,
            selectionMode: "multiple",
            placeholderIcon: "select-category",
          },
        },
      ],
    },
    {
      type: "Section",
      labelKey: "{{i18nScope}}.sections.location.label",
      elements: [
        {
          scope: "/properties/location",
          type: "Control",
          options: {
            control: "hub-field-input-location-picker",
          },
        },
      ],
    },
  ],
};
