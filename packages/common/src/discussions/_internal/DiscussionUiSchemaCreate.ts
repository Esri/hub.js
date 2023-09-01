import { IUiSchema, UiSchemaRuleEffects } from "../../core";

/**
 * @private
 * create uiSchema for Hub Discussions - this
 * defines how the schema properties should be
 * rendered in the Discussions creation experience
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
