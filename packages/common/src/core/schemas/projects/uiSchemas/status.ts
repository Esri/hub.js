import { IUiSchema, UiSchemaControls } from "../../types";

export const uiSchema: IUiSchema = {
  type: "Layout",
  elements: [
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
  ],
};
