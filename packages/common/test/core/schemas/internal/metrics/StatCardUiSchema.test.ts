import { buildUiSchema } from "../../../../../src/core/schemas/internal/metrics/StatCardUiSchema";
import { UiSchemaRuleEffects } from "../../../../../src";
import { MOCK_CONTEXT } from "../../../../mocks/mock-auth";

describe("buildUiSchema: stat", () => {
  it("returns the full stat card uiSchema", async () => {
    const uiSchema = buildUiSchema(
      "some.scope",
      { themeColors: ["#ffffff"] },
      MOCK_CONTEXT
    );

    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Section",
          labelKey: `some.scope.statistic.sectionTitle`,
          options: {
            section: "block",
            open: true,
          },
          elements: [
            {
              type: "Control",
              scope: "/properties/type",
              labelKey: `some.scope.statistic.type.label`,
              options: {
                control: "hub-field-input-tile-select",
                enum: {
                  i18nScope: `some.scope.statistic.type.enum`,
                },
              },
            },
            {
              labelKey: `some.scope.statistic.displayValue`,
              scope: "/properties/value",
              type: "Control",
              rule: {
                condition: {
                  scope: "/properties/type",
                  schema: { const: "static" },
                },
                effect: UiSchemaRuleEffects.SHOW,
              },
            },
            {
              scope: "/properties/dynamicMetric",
              type: "Control",
              labelKey: `some.scope.statistic.dataSource`,
              rule: {
                condition: {
                  scope: "/properties/type",
                  schema: { const: "dynamic" },
                },
                effect: UiSchemaRuleEffects.SHOW,
              },
              options: {
                control: "hub-composite-input-service-query-metric",
              },
            },
            {
              type: "Section",
              labelKey: `some.scope.formatting.sectionTitle`,
              scope: "/properties/allowUnitFormatting",
              options: {
                section: "subblock",
                toggleDisplay: "switch",
                scope: "/properties/unit",
              },
              elements: [
                {
                  labelKey: `some.scope.formatting.unit.label`,
                  scope: "/properties/unit",
                  type: "Control",
                  rule: {
                    condition: {
                      schema: { const: true },
                      scope: "/properties/allowUnitFormatting",
                    },
                    effect: UiSchemaRuleEffects.SHOW,
                  },
                  options: {
                    helperText: {
                      labelKey: `some.scope.formatting.unit.helperText`,
                      placement: "bottom",
                    },
                  },
                },
                {
                  labelKey: `some.scope.formatting.unitPosition.label`,
                  scope: "/properties/unitPosition",
                  type: "Control",
                  rule: {
                    condition: {
                      schema: { const: true },
                      scope: "/properties/allowUnitFormatting",
                    },
                    effect: UiSchemaRuleEffects.SHOW,
                  },
                  options: {
                    control: "hub-field-input-select",
                    enum: {
                      i18nScope: `some.scope.formatting.unitPosition.enum`,
                    },
                  },
                },
              ],
            },
            {
              type: "Section",
              labelKey: `some.scope.advancedConfig.label`,
              options: {
                section: "subblock",
              },
              rule: {
                condition: {
                  scope: "/properties/type",
                  schema: { const: "dynamic" },
                },
                effect: UiSchemaRuleEffects.SHOW,
              },
              elements: [
                {
                  scope: "/properties/serverTimeout",
                  labelKey: `some.scope.advancedConfig.serverTimeout.label`,
                  type: "Control",
                  rule: {
                    condition: {
                      scope: "/properties/type",
                      schema: { const: "dynamic" },
                    },
                    effect: UiSchemaRuleEffects.SHOW,
                  },
                  options: {
                    control: "hub-field-input-input",
                    type: "number",
                    helperText: {
                      labelKey: `some.scope.advancedConfig.serverTimeout.helperText`,
                      placement: "bottom",
                    },
                    messages: [
                      {
                        type: "ERROR",
                        keyword: "type",
                        labelKey: `some.scope.advancedConfig.serverTimeout.errors.type`,
                        icon: true,
                      },
                      {
                        type: "ERROR",
                        keyword: "minimum",
                        labelKey: `some.scope.advancedConfig.serverTimeout.errors.minimum`,
                        icon: true,
                      },
                      {
                        type: "ERROR",
                        keyword: "maximum",
                        labelKey: `some.scope.advancedConfig.serverTimeout.errors.maximum`,
                        icon: true,
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
        {
          type: "Section",
          labelKey: `some.scope.details.sectionTitle`,
          options: {
            section: "block",
          },
          elements: [
            {
              labelKey: `some.scope.details.title`,
              scope: "/properties/cardTitle",
              type: "Control",
            },
            {
              labelKey: `some.scope.details.subtitle`,
              scope: "/properties/subtitle",
              type: "Control",
            },
            {
              labelKey: `some.scope.details.trailingText`,
              scope: "/properties/trailingText",
              type: "Control",
            },
            {
              type: "Section",
              labelKey: `some.scope.details.link.sectionTitle`,
              scope: "/properties/allowLink",
              options: {
                section: "subblock",
                toggleDisplay: "switch",
              },
              rule: {
                condition: {
                  scope: "/properties/type",
                  schema: { const: "static" },
                },
                effect: UiSchemaRuleEffects.SHOW,
              },
              elements: [
                {
                  labelKey: `some.scope.details.link.sourceLink`,
                  scope: "/properties/sourceLink",
                  type: "Control",
                  rule: {
                    condition: {
                      schema: {
                        properties: {
                          type: { const: "static" },
                          allowLink: { const: true },
                        },
                      },
                    },
                    effect: UiSchemaRuleEffects.SHOW,
                  },
                  options: {
                    placeholder: "https://esri.com",
                    messages: [
                      {
                        type: "ERROR",
                        keyword: "required",
                        icon: true,
                        labelKey: `some.scope.errors.sourceLink.required`,
                        allowShowBeforeInteract: true,
                      },
                    ],
                  },
                },
                {
                  labelKey: `some.scope.details.link.sourceTitle`,
                  scope: "/properties/sourceTitle",
                  type: "Control",
                  rule: {
                    condition: {
                      schema: {
                        properties: {
                          type: { const: "static" },
                          allowLink: { const: true },
                        },
                      },
                    },
                    effect: UiSchemaRuleEffects.SHOW,
                  },
                },
              ],
            },
            {
              type: "Control",
              scope: "/properties/allowDynamicLink",
              labelKey: `some.scope.details.allowDynamicLink`,
              rule: {
                condition: {
                  scope: "/properties/type",
                  schema: { const: "dynamic" },
                },
                effect: UiSchemaRuleEffects.SHOW,
              },
              options: {
                layout: "inline-space-between",
                control: "hub-field-input-switch",
              },
            },
          ],
        },
        {
          type: "Section",
          labelKey: `some.scope.appearance.sectionTitle`,
          options: { section: "block" },
          elements: [
            {
              labelKey: `some.scope.appearance.layout.label`,
              scope: "/properties/layout",
              type: "Control",
              rule: {
                effect: UiSchemaRuleEffects.HIDE,
                condition: {
                  scope: "/properties/type",
                  schema: { enum: [undefined, "static", "dynamic"] },
                },
              },
              options: {
                control: "hub-field-input-select",
                enum: {
                  i18nScope: `some.scope.layout.enum`,
                },
              },
            },
            {
              labelKey: `some.scope.appearance.textAlign`,
              scope: "/properties/textAlign",
              type: "Control",
              rule: {
                effect: UiSchemaRuleEffects.HIDE,
                condition: {
                  scope: "/properties/layout",
                  schema: { enum: ["dataViz"] },
                },
              },
              options: {
                control: "hub-field-input-alignment",
              },
            },
            {
              labelKey: `some.scope.appearance.valueColor`,
              scope: "/properties/valueColor",
              type: "Control",
              options: {
                control: "hub-field-input-color",
                savedColors: ["#ffffff"],
              },
            },
            {
              labelKey: `some.scope.appearance.dropShadow.label`,
              scope: "/properties/dropShadow",
              type: "Control",
              rule: {
                effect: UiSchemaRuleEffects.HIDE,
                condition: {
                  scope: "/properties/type",
                  schema: { enum: [undefined, "static", "dynamic"] },
                },
              },
              options: {
                control: "hub-field-input-select",
                enum: {
                  i18nScope: `some.scope.appearance.dropShadow.enum`,
                },
              },
            },

            {
              labelKey: `some.scope.appearance.visualInterest.label`,
              scope: "/properties/visualInterest",
              type: "Control",
              rule: {
                effect: UiSchemaRuleEffects.HIDE,
                condition: {
                  scope: "/properties/type",
                  schema: { enum: [undefined, "static", "dynamic"] },
                },
              },
              options: {
                control: "hub-field-input-select",
                enum: {
                  i18nScope: `some.scope.appearance.visualInterest.enum`,
                },
              },
            },
            // {
            //   type: 'Control',
            //   scope: '/properties/icon',
            //   options: { control: 'hub-composite-input-icon' },
            //   rule: {
            //     effect: UiSchemaRuleEffects.SHOW,
            //     condition: {
            //       scope: '/properties/visualInterest',
            //       schema: { const: 'icon' }
            //     }
            //   }
            // },
            {
              labelKey: `some.scope.appearance.popoverTitle`,
              scope: "/properties/popoverTitle",
              type: "Control",
              rule: {
                effect: UiSchemaRuleEffects.SHOW,
                condition: {
                  scope: "/properties/layout",
                  schema: { const: "moreInfo" },
                },
              },
            },
            {
              labelKey: `some.scope.appearance.popoverDescription`,
              scope: "/properties/popoverDescription",
              type: "Control",
              rule: {
                effect: UiSchemaRuleEffects.SHOW,
                condition: {
                  scope: "/properties/layout",
                  schema: { const: "moreInfo" },
                },
              },
            },
          ],
        },
        {
          type: "Section",
          labelKey: `some.scope.sharing.sectionTitle`,
          options: {
            section: "block",
          },
          elements: [
            {
              labelKey: `some.scope.sharing.showShareIcon`,
              scope: "/properties/shareable",
              type: "Control",
              options: {
                helperText: {
                  labelKey: `some.scope.sharing.showShareIconHelperText`,
                },
                control: "hub-field-input-switch",
                layout: "inline-space-between",
              },
            },
            {
              labelKey: `some.scope.sharing.shareableByValue`,
              scope: "/properties/shareableByValue",
              type: "Control",
              rule: {
                effect: UiSchemaRuleEffects.HIDE,
                condition: {
                  scope: "/properties/type",
                  schema: { enum: [undefined, "static", "dynamic"] },
                },
              },
            },
            {
              labelKey: `some.scope.sharing.shareableOnHover.label`,
              scope: "/properties/shareableOnHover",
              type: "Control",
              rule: {
                condition: {
                  scope: "/properties/shareable",
                  schema: { const: true },
                },
                effect: UiSchemaRuleEffects.SHOW,
              },
              options: {
                control: "hub-field-input-switch",
                helperText: {
                  labelKey: `some.scope.sharing.shareableOnHover.helperText.label`,
                },
                layout: "inline-space-between",
              },
            },
          ],
        },
      ],
    });
  });
});
