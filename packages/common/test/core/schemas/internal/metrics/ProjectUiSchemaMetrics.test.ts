import { HubEntity } from "../../../../../src/core/types/HubEntity";
import { buildUiSchema } from "../../../../../src/core/schemas/internal/metrics/ProjectUiSchemaMetrics";
import { MOCK_CONTEXT } from "../../../../mocks/mock-auth";

describe("buildUiSchema: metric", () => {
  it("returns the full metric uiSchema", () => {
    const uiSchema = buildUiSchema("some.scope", {} as HubEntity, MOCK_CONTEXT);

    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Section",
          elements: [
            {
              labelKey: `some.scope.fields.metrics.cardTitle.label`,
              scope: "/properties/_metric/properties/cardTitle",
              type: "Control",
              options: {
                messages: [
                  {
                    type: "ERROR",
                    keyword: "minLength",
                    labelKey:
                      "some.scope.fields.metrics.cardTitle.message.minLength",
                    icon: true,
                    allowShowBeforeInteract: true,
                  },
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
              type: "Section",
              labelKey: `some.scope.sections.metrics.source.label`,
              options: {
                section: "block",
                open: true,
              },
              elements: [
                {
                  labelKey: `some.scope.fields.metrics.value.label`,
                  scope: "/properties/_metric/properties/value",
                  type: "Control",
                  options: {
                    messages: [
                      {
                        type: "ERROR",
                        keyword: "minLength",
                        labelKey:
                          "some.scope.fields.metrics.value.message.minLength",
                        icon: true,
                      },
                      {
                        type: "ERROR",
                        keyword: "required",
                        labelKey: `some.scope.fields.metrics.value.message.required`,
                        icon: true,
                      },
                    ],
                  },
                },
              ],
            },
            {
              type: "Section",
              labelKey: `some.scope.sections.metrics.formatting.label`,
              options: {
                section: "block",
                open: true,
              },
              elements: [
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
              labelKey: `some.scope.sections.metrics.appearance.label`,
              options: {
                section: "block",
                open: false,
              },
              elements: [
                {
                  labelKey: `some.scope.fields.metrics.trailingText.label`,
                  scope: "/properties/_metric/properties/trailingText",
                  type: "Control",
                },
              ],
            },
          ],
        },
      ],
    });
  });
});
