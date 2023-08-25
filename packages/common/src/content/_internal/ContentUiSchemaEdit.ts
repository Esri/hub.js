import { IUiSchema } from "../../core";

/**
 * @private
 */
export const uiSchema: IUiSchema = {
  type: "Layout",
  elements: [
    {
      type: "Section",
      labelKey: "{{i18nScope}}.sections.basic.title",
      elements: [
        // title
        {
          labelKey: "{{i18nScope}}.fields.title.label",
          scope: "/properties/name",
          type: "Control",
          options: {
            helperText: {
              labelKey: "{{i18nScope}}.fields.title.hint",
            },
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
        // summary
        {
          labelKey: "{{i18nScope}}.fields.summary.label",
          scope: "/properties/summary",
          type: "Control",
          options: {
            control: "hub-field-input-input",
            type: "textarea",
            helperText: {
              labelKey: "{{i18nScope}}.fields.summary.hint",
            },
          },
        },
        // description
        {
          labelKey: "{{i18nScope}}.fields.description.label",
          scope: "/properties/description",
          type: "Control",
          options: {
            control: "hub-field-input-input",
            type: "textarea",
            helperText: {
              labelKey: "{{i18nScope}}.fields.description.hint",
            },
          },
        },
        // thumbnail image
        {
          labelKey: "{{i18nScope}}.fields._thumbnail.label",
          scope: "/properties/_thumbnail",
          type: "Control",
          options: {
            control: "hub-field-input-image-picker",
            maxWidth: 727,
            maxHeight: 484,
            aspectRatio: 1.5,
            helperText: {
              labelKey: "{{i18nScope}}.fields._thumbnail.helperText",
            },
          },
        },
        // tags
        {
          labelKey: "{{i18nScope}}.fields.tags.label",
          scope: "/properties/tags",
          type: "Control",
          options: {
            control: "hub-field-input-combobox",
            allowCustomValues: true,
            selectionMode: "multiple",
            placeholderIcon: "label",
            helperText: { labelKey: "{{i18nScope}}.fields.tags.hint" },
          },
        },
        // categories
        {
          labelKey: "{{i18nScope}}.fields.categories.label",
          scope: "/properties/categories",
          type: "Control",
          options: {
            control: "hub-field-input-combobox",
            allowCustomValues: false,
            selectionMode: "multiple",
            placeholderIcon: "select-category",
            helperText: {
              labelKey: "{{i18nScope}}.fields.categories.agolHint", // TODO: hint should describe whether it can be set on Enterprise or Online
            },
          },
        },
      ],
    },
    // location section
    {
      type: "Section",
      labelKey: "{{i18nScope}}.sections.location.label",
      options: {
        helperText: {
          labelKey: "{{i18nScope}}.sections.location.helperText",
        },
      },
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
