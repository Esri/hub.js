import { UiSchemaRuleEffects } from "../../types";

/**
 * Shared metric rules for uiSchema
 */

/** Show if the type is set to static */
export const SHOW_FOR_STATIC_RULE_ENTITY = {
  condition: {
    scope: "/properties/_metric/properties/type",
    schema: { const: "static" },
  },
  effect: UiSchemaRuleEffects.SHOW,
};

/** Show if the type is set to dynamic */
export const SHOW_FOR_DYNAMIC_RULE_ENTITY = {
  condition: {
    scope: "/properties/_metric/properties/type",
    schema: { const: "dynamic" },
  },
  effect: UiSchemaRuleEffects.SHOW,
};

/** Show if sharing is enabled */
export const SHOW_FOR_SHARING_RULE_ENTITY = {
  condition: {
    scope: "/properties/_metric/properties/shareable",
    schema: { const: true },
  },
  effect: UiSchemaRuleEffects.SHOW,
};
