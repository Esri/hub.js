import { UiSchemaControls, IUiSchemaElement } from "../types";

export const ENTITY_NAME_UI_SCHEMA: IUiSchemaElement = {
  labelKey: "{{i18nScope}}.fields.name.label",
  scope: "/properties/name",
  type: "Control",
};

export const ENTITY_SUMMARY_UI_SCHEMA: IUiSchemaElement = {
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
};
