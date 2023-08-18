import { IUiSchema, UiSchemaRuleEffects } from "../../core/schemas/types";

const HIDE_FOR_ALL = {
  effect: UiSchemaRuleEffects.HIDE,
  condition: {
    scope: '/properties/type',
    schema: { enum: [undefined, 'static', 'dynamic'] }
  }
}

const HIDE_FOR_DATA_VIZ_RULE = {
  effect: UiSchemaRuleEffects.HIDE,
  condition: {
    scope: '/properties/_metric/properties/layout',
    schema: { enum: ['dataViz'] }
  }
};

const SHOW_FOR_MORE_INFO_RULE = {
  effect: UiSchemaRuleEffects.SHOW,
  condition: {
    scope: '/properties/_metric/properties/layout',
    schema: { const: 'moreInfo' }
  }
};

const SHOW_FOR_DYNAMIC_RULE = {
  condition: {
    scope: '/properties/_metric/properties/type',
    schema: { const: 'dynamic' },
  },
  effect: UiSchemaRuleEffects.SHOW,
};

const SHOW_FOR_STATIC_RULE = {
  condition: {
    scope: '/properties/_metric/properties/type',
    schema: { const: 'static' },
  },
  effect: UiSchemaRuleEffects.SHOW,
}

const SHOW_FOR_SHARING_RULE = {
  condition: {
    scope: '/properties/_metric/properties/shareable',
    schema: { const: true },
  },
  effect: UiSchemaRuleEffects.SHOW,
}

const SHOW_FOR_LINK_SECTION_ENABLED_AND_STATIC = {
  condition: {
    schema: {
      properties: {
        type: { const: 'static' },
        allowLink: { const: true }
      }
    }
  },
  effect: UiSchemaRuleEffects.SHOW,
}

/**
 * uiSchema for Hub Project metrics - this defines
 * how the schema properties should be rendered in the
 * project metrics editing experience
 */
export const uiSchema: IUiSchema = {
  type: "Layout",
  elements: [
    {
      label: "Title",
      scope: "/properties/_metric/properties/cardTitle",
      type: "Control"
    },
    {
      type: "Section",
      label: "Source",
      options: {
        section: "block",
        open: true,
      },
      elements: [
        {
          scope: "/properties/_metric/properties/type",
          type: "Control",
          options: {
            control: "hub-field-input-tile-select",
            labels: ["Dynamic", "Static"]
          }
        },
        {
          scope: '/properties/_metric/properties/value',
          type: 'Control',
          label: 'Display Value',
          rule: SHOW_FOR_STATIC_RULE,
        },
        {
          scope: '/properties/_metric/properties/dynamicMetric',
          type: 'Control',
          label: 'Data Source',
          rule: SHOW_FOR_DYNAMIC_RULE,
          options: {
            control: 'hub-composite-input-service-query-metric'
          }
        },
        {
          scope: '/properties/_metric/properties/unit',
          type: 'Control',
          label: 'Unit',
          options: {
            helperText: {
              label: 'Use to set a prefix or postfix value, such as %, +, %, or other.',
              placement: 'bottom'
            },
          }
        }
      ]
    }
  ],
};
