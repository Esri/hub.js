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
        },
      ],
    },
  ],
};
