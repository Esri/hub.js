import { IUiSchemaRule, UiSchemaRuleEffects } from "../types";

/**
 * This rule will always hide the associated element and is useful
 * when validation-only fields need to be included in a UI Schema.
 * NOTE: the "type" field must be included in the schema for this to work
 */
export const ALWAYS_HIDE: IUiSchemaRule = {
  effect: UiSchemaRuleEffects.SHOW,
  condition: {
    schema: {
      properties: {
        type: { const: "non-existent-type" },
      },
    },
  },
};
