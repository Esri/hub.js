import { UiSchemaRuleEffects } from "../../types";

export enum LAYOUTS {
  simple = "simple",
  dataViz = "dataViz",
  moreInfo = "moreInfo",
}
export enum SCALE {
  small = "s",
  medium = "m",
  large = "l",
}
export enum UNIT_POSITIONS {
  before = "before",
  after = "after",
  below = "below",
}
export enum VISUAL_INTEREST {
  none = "none",
  sparkline = "sparkline",
  icon = "icon",
  logo = "logo",
}
export enum SOURCE {
  dynamic = "dynamic",
  static = "static",
}

/***************** Rules *****************/
export const SHOW_FOR_STATIC_RULE_ENTITY = {
  condition: {
    scope: "/properties/_metric/properties/type",
    schema: { const: "static" },
  },
  effect: UiSchemaRuleEffects.SHOW,
};

export const SHOW_FOR_DYNAMIC_RULE_ENTITY = {
  condition: {
    scope: "/properties/_metric/properties/type",
    schema: { const: "dynamic" },
  },
  effect: UiSchemaRuleEffects.SHOW,
};

export const SHOW_FOR_SHARING_RULE_ENTITY = {
  condition: {
    scope: "/properties/_metric/properties/shareable",
    schema: { const: true },
  },
  effect: UiSchemaRuleEffects.SHOW,
};
