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
    {
      type: "Section",
      labelKey: "{{i18nScope}}.sections.location.label",
      elements: [
        {
          scope: "/properties/extent",
          type: "Control",
          options: {
            control: UiSchemaControls.boundaryPicker,
          },
        },
        {
          labelKey: "{{i18nScope}}.fields.showMap.label",
          scope: "/properties/view/properties/showMap",
          type: "Control",
        },
      ],
    },
    {
      type: "Section",
      labelKey: "{{i18nScope}}.sections.status.label",
      elements: [
        {
          scope: "/properties/status",
          type: "Control",
          labelKey: "{{i18nScope}}.fields.status.label",
          options: {
            control: UiSchemaControls.select,
            enum: {
              i18nScope: "{{i18nScope}}.fields.status.enum",
            },
          },
        },
      ],
    },
    {
      type: "Section",
      labelKey: "{{i18nScope}}.sections.timeline.label",
      elements: [
        {
          scope: "/properties/view/properties/timeline",
          type: "Control",
          options: {
            control: UiSchemaControls.timeline,
          },
        },
      ],
    },
    {
      type: "Section",
      labelKey: "{{i18nScope}}.sections.featuredContent.label",
      options: {
        helperText: {
          labelKey: "{{i18nScope}}.sections.featuredContent.helperText",
        },
      },
      elements: [
        {
          scope: "/properties/view/properties/featuredContentIds",
          type: "Control",
          options: {
            control: UiSchemaControls.galleryPicker,
            targetEntity: "item",
            limit: 4,
          },
        },
      ],
    },
  ],
};
