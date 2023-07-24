import { IUiSchema } from "../../core";

/**
 * settings uiSchema for Hub Projects - this defines
 * how the schema properties should be rendered in the
 * project settings pane
 */
export const uiSchema: IUiSchema = {
  type: "Layout",
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
  ],
};
