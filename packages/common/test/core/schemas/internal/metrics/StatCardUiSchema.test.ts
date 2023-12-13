import { buildUiSchema } from "../../../../../src/core/schemas/internal/metrics/StatCardUiSchema";
import { UiSchemaRuleEffects } from "../../../../../src/core/schemas/types";
import { MOCK_CONTEXT } from "../../../../mocks/mock-auth";

describe("buildUiSchema: stat", () => {
  it("returns the full stat card uiSchema", async () => {
    const uiSchema = buildUiSchema(
      "",
      { themeColors: ["#ffffff"] },
      MOCK_CONTEXT
    );

    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Section",
          labelKey: `statistic.sectionTitle`,
          options: {
            section: "block",
            open: true,
          },
          elements: [
            {
              type: "Control",
              scope: "/properties/type",
              labelKey: `statistic.type.label`,
              options: {
                control: "hub-field-input-tile-select",
                enum: {
                  i18nScope: `statistic.type.enum`,
                },
              },
            },
            {
              labelKey: `statistic.displayValue`,
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
              labelKey: `statistic.dataSource`,
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
              labelKey: `formatting.sectionTitle`,
              scope: "/properties/allowUnitFormatting",
              options: {
                section: "subblock",
                toggleDisplay: "switch",
                scope: "/properties/unit",
              },
              elements: [
                {
                  labelKey: `formatting.unit.label`,
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
                      labelKey: `formatting.unit.helperText`,
                      placement: "bottom",
                    },
                  },
                },
                {
                  labelKey: `formatting.unitPosition.label`,
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
                      i18nScope: `formatting.unitPosition.enum`,
                    },
                  },
                },
              ],
            },
            {
              type: "Section",
              labelKey: `advancedConfig.label`,
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
                  labelKey: `advancedConfig.serverTimeout.label`,
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
                      labelKey: `advancedConfig.serverTimeout.helperText`,
                      placement: "bottom",
                    },
                    messages: [
                      {
                        type: "ERROR",
                        keyword: "type",
                        labelKey: `advancedConfig.serverTimeout.errors.type`,
                        icon: true,
                      },
                      {
                        type: "ERROR",
                        keyword: "minimum",
                        labelKey: `advancedConfig.serverTimeout.errors.minimum`,
                        icon: true,
                      },
                      {
                        type: "ERROR",
                        keyword: "maximum",
                        labelKey: `advancedConfig.serverTimeout.errors.maximum`,
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
          labelKey: `details.sectionTitle`,
          options: {
            section: "block",
          },
          elements: [
            {
              labelKey: `details.title`,
              scope: "/properties/cardTitle",
              type: "Control",
            },
            {
              labelKey: `details.subtitle`,
              scope: "/properties/subtitle",
              type: "Control",
            },
            {
              labelKey: `details.trailingText`,
              scope: "/properties/trailingText",
              type: "Control",
            },
            {
              type: "Section",
              labelKey: `details.link.sectionTitle`,
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
                  labelKey: `details.link.sourceLink`,
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
                        labelKey: `errors.sourceLink.required`,
                        allowShowBeforeInteract: true,
                      },
                    ],
                  },
                },
                {
                  labelKey: `details.link.sourceTitle`,
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
              labelKey: `details.allowDynamicLink`,
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
          labelKey: `appearance.sectionTitle`,
          options: { section: "block" },
          elements: [
            {
              labelKey: `appearance.layout.label`,
              scope: "/properties/layout",
              type: "Control",
              rule: {
                effect: UiSchemaRuleEffects.HIDE,
                condition: {
                  scope: "/properties/type",
                  schema: { enum: ["static", "dynamic"] },
                },
              },
              options: {
                control: "hub-field-input-select",
                enum: {
                  i18nScope: `layout.enum`,
                },
              },
            },
            {
              labelKey: `appearance.textAlign`,
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
              labelKey: `appearance.valueColor`,
              scope: "/properties/valueColor",
              type: "Control",
              options: {
                control: "hub-field-input-color",
                savedColors: ["#ffffff"],
              },
            },
            {
              labelKey: `appearance.dropShadow.label`,
              scope: "/properties/dropShadow",
              type: "Control",
              rule: {
                effect: UiSchemaRuleEffects.HIDE,
                condition: {
                  scope: "/properties/type",
                  schema: { enum: ["static", "dynamic"] },
                },
              },
              options: {
                control: "hub-field-input-select",
                enum: {
                  i18nScope: `appearance.dropShadow.enum`,
                },
              },
            },

            {
              labelKey: `appearance.visualInterest.label`,
              scope: "/properties/visualInterest",
              type: "Control",
              rule: {
                effect: UiSchemaRuleEffects.HIDE,
                condition: {
                  scope: "/properties/type",
                  schema: { enum: ["static", "dynamic"] },
                },
              },
              options: {
                control: "hub-field-input-select",
                enum: {
                  i18nScope: `appearance.visualInterest.enum`,
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
              labelKey: `appearance.popoverTitle`,
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
              labelKey: `appearance.popoverDescription`,
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
          labelKey: `sharing.sectionTitle`,
          options: {
            section: "block",
          },
          elements: [
            {
              labelKey: `sharing.showShareIcon`,
              scope: "/properties/shareable",
              type: "Control",
              options: {
                helperText: {
                  labelKey: `sharing.showShareIconHelperText`,
                },
                control: "hub-field-input-switch",
                layout: "inline-space-between",
              },
            },
            {
              labelKey: `sharing.shareableByValue`,
              scope: "/properties/shareableByValue",
              type: "Control",
              rule: {
                effect: UiSchemaRuleEffects.HIDE,
                condition: {
                  scope: "/properties/type",
                  schema: { enum: ["static", "dynamic"] },
                },
              },
            },
            {
              labelKey: `sharing.shareableOnHover.label`,
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
                  labelKey: `sharing.shareableOnHover.helperText.label`,
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
