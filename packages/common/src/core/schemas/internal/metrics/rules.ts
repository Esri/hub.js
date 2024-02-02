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

export const SHOW_FOR_STATIC_AND_STRING_RULE_ENTITY = {
  condition: {
    schema: {
      properties: {
        _metric: {
          properties: {
            type: { const: "static" },
            valueType: { const: "string" },
          },
        },
      },
    },
  },
  effect: UiSchemaRuleEffects.SHOW,
};

export const SHOW_FOR_STATIC_AND_NUMBER_RULE_ENTITY = {
  condition: {
    schema: {
      properties: {
        _metric: {
          properties: {
            type: { const: "static" },
            valueType: { const: "number" },
          },
        },
      },
    },
  },
  effect: UiSchemaRuleEffects.SHOW,
};

export const SHOW_FOR_STATIC_AND_DATE_RULE_ENTITY = {
  condition: {
    schema: {
      properties: {
        _metric: {
          properties: {
            type: { const: "static" },
            valueType: { const: "date" },
          },
        },
      },
    },
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

export const SHOW_FOR_DYNAMIC_RULE = {
  condition: {
    scope: "/properties/_metric/properties/type",
    schema: { const: "dynamic" },
  },
  effect: UiSchemaRuleEffects.SHOW,
};

export const SHOW_FOR_DYNAMIC_RULE_AND_CHART = {
  condition: {
    schema: {
      properties: {
        _metric: {
          properties: {
            type: { const: "dynamic" },
            displayType: { enum: ["chart", "stat-with-chart"] },
          },
        },
      },
    },
  },
  effect: UiSchemaRuleEffects.SHOW,
};

export const SHOW_FOR_DYNAMIC_RULE_AND_BAR_CHART = {
  condition: {
    schema: {
      properties: {
        _metric: {
          properties: {
            type: { const: "dynamic" },
            displayType: { enum: ["chart", "stat-with-chart"] },
            chartType: { const: "bar" },
          },
        },
      },
    },
  },
  effect: UiSchemaRuleEffects.SHOW,
};
