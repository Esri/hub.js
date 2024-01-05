import { HubEntity } from "../../../../../src/core/types/HubEntity";
import { buildUiSchema } from "../../../../../src/core/schemas/internal/metrics/ProjectUiSchemaMetrics";
import { MOCK_CONTEXT } from "../../../../mocks/mock-auth";
import { UiSchemaRuleEffects } from "../../../../../src/core/schemas/types";

describe("buildUiSchema: metric", () => {
  it("returns the full metric uiSchema", () => {
    const uiSchema = buildUiSchema("some.scope", {} as HubEntity, MOCK_CONTEXT);

    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Section",
          labelKey: "some.scope.sections.metrics.basic.label",
          elements: [
            {
              labelKey: `some.scope.fields.metrics.cardTitle.label`,
              scope: "/properties/_metric/properties/cardTitle",
              type: "Control",
              options: {
                messages: [
                  {
                    type: "ERROR",
                    keyword: "required",
                    labelKey: `some.scope.fields.metrics.cardTitle.message.required`,
                    icon: true,
                  },
                ],
              },
            },
          ],
        },
        {
          type: "Section",
          labelKey: `some.scope.sections.metrics.source.label`,
          elements: [
            {
              labelKey: "some.scope.fields.metrics.type.label",
              scope: "/properties/_metric/properties/type",
              type: "Control",
              options: {
                control: "hub-field-input-tile-select",
                enum: {
                  i18nScope: "some.scope.fields.metrics.type.enum",
                },
              },
            },
            {
              labelKey: `some.scope.fields.metrics.value.label`,
              scope: "/properties/_metric/properties/value",
              type: "Control",
              rule: {
                condition: {
                  scope: "/properties/_metric/properties/type",
                  schema: { const: "static" },
                },
                effect: UiSchemaRuleEffects.SHOW,
              },
              options: {
                messages: [
                  {
                    type: "ERROR",
                    keyword: "required",
                    labelKey: `some.scope.fields.metrics.value.message.required`,
                    icon: true,
                  },
                ],
              },
            },
            {
              scope: "/properties/_metric/properties/dynamicMetric",
              type: "Control",
              labelKey: `some.scope.fields.metrics.dynamicMetric.label`,
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
              labelKey: `some.scope.fields.metrics.unit.label`,
              scope: "/properties/_metric/properties/unit",
              type: "Control",
              options: {
                helperText: {
                  labelKey: `some.scope.fields.metrics.unit.helperText`,
                  placement: "bottom",
                },
              },
            },
            {
              labelKey: `some.scope.fields.metrics.unitPosition.label`,
              scope: "/properties/_metric/properties/unitPosition",
              type: "Control",
              options: {
                control: "hub-field-input-select",
                enum: {
                  i18nScope: `some.scope.fields.metrics.unitPosition.enum`,
                },
              },
            },
          ],
        },
        {
          type: "Section",
          labelKey: `some.scope.sections.metrics.formatting.label`,
          elements: [
            {
              labelKey: `some.scope.fields.metrics.trailingText.label`,
              scope: "/properties/_metric/properties/trailingText",
              type: "Control",
            },
            {
              labelKey: `some.scope.fields.metrics.sourceLink.label`,
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
                    labelKey: `some.scope.fields.metrics.sourceLink.message.required`,
                    allowShowBeforeInteract: true,
                  },
                ],
              },
            },
            {
              labelKey: `some.scope.fields.metrics.sourceTitle.label`,
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
              labelKey: `some.scope.fields.metrics.allowDynamicLink.label`,
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
        {
          type: "Section",
          labelKey: `some.scope.sections.metrics.sharing.label`,
          elements: [
            {
              labelKey: `some.scope.fields.metrics.showShareIcon.label`,
              scope: "/properties/_metric/properties/shareable",
              type: "Control",
              options: {
                helperText: {
                  labelKey: `some.scope.fields.metrics.showShareIcon.helperText.label`,
                },
                control: "hub-field-input-switch",
                layout: "inline-space-between",
              },
            },
            {
              labelKey: `some.scope.fields.metrics.shareableOnHover.label`,
              scope: "/properties/_metric/properties/shareableOnHover",
              type: "Control",
              rule: {
                condition: {
                  scope: "/properties/_metric/properties/shareable",
                  schema: { const: true },
                },
                effect: UiSchemaRuleEffects.SHOW,
              },
              options: {
                control: "hub-field-input-switch",
                helperText: {
                  labelKey: `some.scope.fields.metrics.shareableOnHover.helperText.label`,
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
