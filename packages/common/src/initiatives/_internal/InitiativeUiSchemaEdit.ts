import { IUiSchema } from "../../core";

/**
 * complete edit UI Schema for Hub Initiatives
 */
export const uiSchema: IUiSchema = {
  type: "Layout",
  elements: [
    {
      type: "Section",
      labelKey: "{{i18nScope}}.sections.basicInfo.label",
      elements: [
        {
          labelKey: "{{i18nScope}}.fields.name.label",
          scope: "/properties/name",
          type: "Control",
          options: {
            messages: [
              {
                type: "ERROR",
                keyword: "required",
                icon: true,
                labelKey: "{{i18nScope}}.fields.name.requiredError",
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
          labelKey: "{{i18nScope}}.fields.tags.label",
          scope: "/properties/tags",
          type: "Control",
          options: {
            control: "hub-field-input-combobox",
            allowCustomValues: true,
            selectionMode: "multiple",
            placeholderIcon: "label",
            helperText: { labelKey: "{{i18nScope}}.fields.tags.helperText" },
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
            helperText: {
              labelKey: "{{i18nScope}}.fields.categories.helperText",
            },
          },
        },
      ],
    },
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
