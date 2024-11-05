import {
  buildUiSchema,
  buildDefaults,
} from "../../../../../src/core/schemas/internal/metrics/ProjectUiSchemaMetrics";
import { MOCK_CONTEXT } from "../../../../mocks/mock-auth";
import { UiSchemaRuleEffects } from "../../../../../src/core/schemas/types";
import { EntityEditorOptions } from "../../../../../src/core/schemas/internal/EditorOptions";
import { IHubProject } from "../../../../../src/core/types";

describe("ProjectUiSchemaMetrics", () => {
  describe("buildUiSchema", () => {
    it("returns the full metric uiSchema", async () => {
      const uiSchema = await buildUiSchema(
        "shared",
        {} as EntityEditorOptions,
        MOCK_CONTEXT
      );

      expect(uiSchema).toEqual({
        type: "Layout",
        elements: [
          {
            type: "Section",
            labelKey: "shared.sections.metrics.basic.label",
            elements: [
              {
                labelKey: `shared.fields.metrics.cardTitle.label`,
                scope: "/properties/_metric/properties/cardTitle",
                type: "Control",
                options: {
                  messages: [
                    {
                      type: "ERROR",
                      keyword: "required",
                      labelKey: `shared.fields.metrics.cardTitle.message.required`,
                      icon: true,
                    },
                  ],
                },
              },
            ],
          },
          {
            type: "Section",
            labelKey: `shared.sections.metrics.source.label`,
            elements: [
              {
                labelKey: "shared.fields.metrics.type.label",
                scope: "/properties/_metric/properties/type",
                type: "Control",
                options: {
                  control: "hub-field-input-tile-select",
                  rules: [
                    [],
                    [],
                    [
                      {
                        effect: UiSchemaRuleEffects.SHOW,
                        // only show in alpha
                        conditions: [false],
                      },
                    ],
                  ],
                  enum: {
                    i18nScope: "shared.fields.metrics.type.enum",
                  },
                },
              },
              {
                scope: "/properties/_metric/properties/valueType",
                type: "Control",
                labelKey: `shared.fields.metrics.valueType.label`,
                rule: {
                  condition: {
                    scope: "/properties/_metric/properties/type",
                    schema: { const: "static" },
                  },
                  effect: UiSchemaRuleEffects.SHOW,
                },
                options: {
                  control: "hub-field-input-tile-select",
                  layout: "horizontal",
                  helperText: {
                    labelKey: `shared.fields.metrics.valueType.helperText`,
                    placement: "top",
                  },
                  enum: {
                    i18nScope: `shared.fields.metrics.valueType.enum`,
                  },
                },
              },
              {
                labelKey: `shared.fields.metrics.value.label`,
                scope: "/properties/_metric/properties/value",
                type: "Control",
                rules: [
                  {
                    condition: {
                      schema: {
                        type: "object",
                        properties: {
                          _metric: {
                            type: "object",
                            properties: {
                              type: { const: "static" },
                              valueType: { const: "string" },
                            },
                          },
                        },
                      },
                    },
                    effect: UiSchemaRuleEffects.SHOW,
                  },
                ],
                options: {
                  control: "hub-field-input-input",
                  clearOnHidden: true,
                  messages: [
                    {
                      type: "ERROR",
                      keyword: "required",
                      labelKey: `shared.fields.metrics.value.message.required`,
                      icon: true,
                    },
                  ],
                },
              },
              {
                labelKey: `shared.fields.metrics.value.label`,
                scope: "/properties/_metric/properties/value",
                type: "Control",
                rules: [
                  {
                    condition: {
                      schema: {
                        type: "object",
                        properties: {
                          _metric: {
                            type: "object",
                            properties: {
                              type: { const: "static" },
                              valueType: { const: "number" },
                            },
                          },
                        },
                      },
                    },
                    effect: UiSchemaRuleEffects.SHOW,
                  },
                ],
                options: {
                  control: "hub-field-input-input",
                  type: "number",
                  clearOnHidden: true,
                  messages: [
                    {
                      type: "ERROR",
                      keyword: "required",
                      labelKey: `shared.fields.metrics.value.message.required`,
                      icon: true,
                    },
                  ],
                },
              },
              {
                labelKey: `shared.fields.metrics.value.label`,
                scope: "/properties/_metric/properties/value",
                type: "Control",
                rules: [
                  {
                    condition: {
                      schema: {
                        type: "object",
                        properties: {
                          _metric: {
                            type: "object",
                            properties: {
                              type: { const: "static" },
                              valueType: { const: "date" },
                            },
                          },
                        },
                      },
                    },
                    effect: UiSchemaRuleEffects.SHOW,
                  },
                ],
                options: {
                  control: "hub-field-input-date",
                  clearOnHidden: true,
                  messages: [
                    {
                      type: "ERROR",
                      keyword: "required",
                      labelKey: `shared.fields.metrics.value.message.required`,
                      icon: true,
                    },
                  ],
                },
              },
              {
                scope: "/properties/_metric/properties/dynamicMetric",
                type: "Control",
                labelKey: `shared.fields.metrics.dynamicMetric.label`,
                rule: {
                  condition: {
                    scope: "/properties/_metric/properties/type",
                    schema: { const: "dynamic" },
                  },
                  effect: UiSchemaRuleEffects.SHOW,
                },
                options: {
                  control: "hub-composite-input-service-query-metric",
                },
              },
              {
                labelKey: `shared.fields.metrics.unit.label`,
                scope: "/properties/_metric/properties/unit",
                type: "Control",
                options: {
                  helperText: {
                    labelKey: `shared.fields.metrics.unit.helperText`,
                    placement: "top",
                  },
                },
              },
              {
                labelKey: `shared.fields.metrics.unitPosition.label`,
                scope: "/properties/_metric/properties/unitPosition",
                type: "Control",
                options: {
                  control: "hub-field-input-select",
                  enum: {
                    i18nScope: `shared.fields.metrics.unitPosition.enum`,
                  },
                },
              },
            ],
          },
          {
            type: "Section",
            labelKey: `shared.sections.metrics.formatting.label`,
            elements: [
              {
                labelKey: `shared.fields.metrics.trailingText.label`,
                scope: "/properties/_metric/properties/trailingText",
                type: "Control",
              },
              {
                labelKey: `shared.fields.metrics.sourceLink.label`,
                scope: "/properties/_metric/properties/sourceLink",
                type: "Control",
                rule: {
                  condition: {
                    scope: "/properties/_metric/properties/type",
                    schema: { const: "static" },
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
                      labelKey: `shared.fields.metrics.sourceLink.message.required`,
                      allowShowBeforeInteract: true,
                    },
                    {
                      type: "ERROR",
                      keyword: "format",
                      icon: true,
                      labelKey: "shared.errors.urlFormat",
                    },
                    {
                      type: "ERROR",
                      keyword: "if",
                      hidden: true,
                    },
                  ],
                },
              },
              {
                labelKey: `shared.fields.metrics.sourceTitle.label`,
                scope: "/properties/_metric/properties/sourceTitle",
                type: "Control",
                rule: {
                  condition: {
                    scope: "/properties/_metric/properties/type",
                    schema: { const: "static" },
                  },
                  effect: UiSchemaRuleEffects.SHOW,
                },
              },
              {
                type: "Control",
                scope: "/properties/_metric/properties/allowDynamicLink",
                labelKey: `shared.fields.metrics.allowDynamicLink.label`,
                rule: {
                  condition: {
                    scope: "/properties/_metric/properties/type",
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
        ],
      });
    });
  });

  describe("buildDefaults: project metrics", () => {
    it("returns the defaults to create a project metric", async () => {
      const defaults = await buildDefaults(
        "some.scope",
        {} as IHubProject,
        MOCK_CONTEXT
      );
      expect(defaults).toEqual({
        _metric: {
          cardTitle: "{{shared.fields.metrics.cardTitle.label:translate}}",
        },
      });
    });
  });
});
