import { IUiSchema } from "../../core";

/**
 * complete edit uiSchema for Hub Groups - this defines
 * how the schema properties should be rendered in the
 * group editing experience
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
          labelKey: "{{i18nScope}}.fields.thumbnail.label",
          scope: "/properties/thumbnail",
          type: "Control",
          options: {
            control: "hub-field-input-image-picker",
            maxWidth: 727,
            maxHeight: 484,
            aspectRatio: 1.5,
            helperText: {
              labelKey: "{{i18nScope}}.fields.thumbnail.helperText",
            },
          },
        },
      ],
    },
  ],
};
