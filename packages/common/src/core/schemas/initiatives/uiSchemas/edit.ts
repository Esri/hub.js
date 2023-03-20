import { IUiSchema } from "../../types";
import { ENTITY_NAME_UI_SCHEMA, ENTITY_SUMMARY_UI_SCHEMA } from "../../shared";

export const uiSchema: IUiSchema = {
  type: "Layout",
  elements: [
    {
      type: "Section",
      labelKey: "{{i18nScope}}.sections.basicInfo.label",
      elements: [ENTITY_NAME_UI_SCHEMA, ENTITY_SUMMARY_UI_SCHEMA],
    },
  ],
};
