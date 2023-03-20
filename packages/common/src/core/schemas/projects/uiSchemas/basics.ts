import { IUiSchema, UiSchemaControls } from "../../types";
import { ENTITY_NAME_UI_SCHEMA, ENTITY_SUMMARY_UI_SCHEMA } from "../../shared";

export const uiSchema: IUiSchema = {
  type: "Layout",
  elements: [
    {
      type: "Section",
      labelKey: "{{i18nScope}}.sections.basicInfo.label",
      elements: [
        ENTITY_NAME_UI_SCHEMA,
        ENTITY_SUMMARY_UI_SCHEMA,
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
