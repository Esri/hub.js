import { IUiSchema, UiSchemaControls } from "../../types";

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
        },
        {
          labelKey: "{{i18nScope}}.fields.summary.label",
          scope: "/properties/summary",
          type: "Control",
          options: {
            control: UiSchemaControls.input,
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
            control: UiSchemaControls.input,
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
            control: UiSchemaControls.imagePicker,
            maxWidth: 727,
            maxHeight: 484,
            aspectRatio: 1.5,
            helperText: {
              labelKey: "{{i18nScope}}.fields.featuredImage.helperText",
            },
            sizeDescription: {
              labelKey: "{{i18nScope}}.fields.featuredImage.sizeDescription",
            },
          },
        },
      ],
    },
  ],
};
