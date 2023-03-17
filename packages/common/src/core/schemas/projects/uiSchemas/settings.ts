import { IUiSchema, UiSchemaControls } from "../../types";

export const uiSchema: IUiSchema = {
  type: "Layout",
  elements: [
    {
      scope: "/properties/tags",
      labelKey: "{{i18nScope}}.fields.tags.label",
      type: "Control",
      options: {
        control: UiSchemaControls.multiselect,
      },
    },
  ],
};
