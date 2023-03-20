import { IUiSchema, UiSchemaControls } from "../../types";

export const uiSchema: IUiSchema = {
  type: "Layout",
  elements: [
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
  ],
};
