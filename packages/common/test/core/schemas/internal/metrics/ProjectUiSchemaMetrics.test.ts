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
              labelKey: `some.scope.fields.cardTitle.label`,
              scope: "/properties/_metrics/properties/cardTitle",
              type: "Control",
              options: {
                messages: [
                  {
                    type: "ERROR",
                    keyword: "minLength",
                    labelKey: "some.scope.fields.cardTitle.message.minLength",
                    icon: true,
                    allowShowBeforeInteract: true,
                  },
                ],
              },
            },
            {
              type: "Section",
              labelKey: `some.scope.sections.source.label`,
              options: {
                section: "block",
                open: true,
              },
              elements: [
                {
                  labelKey: `some.scope.fields.value.label`,
                  scope: "/properties/_metrics/properties/value",
                  type: "Control",
                  options: {
                    messages: [
                      {
                        type: "ERROR",
                        keyword: "minLength",
                        labelKey: "some.scope.fields.value.message.minLength",
                        icon: true,
                        allowShowBeforeInteract: true,
                      },
                    ],
                  },
                },
              ],
            },
            {
              type: "Section",
              labelKey: `some.scope.sections.formatting.label`,
              options: {
                section: "block",
                open: true,
              },
              elements: [
                {
                  labelKey: `some.scope.fields.unit.label`,
                  scope: "/properties/_metrics/properties/unit",
                  type: "Control",
                  options: {
                    helperText: {
                      labelKey: `some.scope.fields.unit.helperText`,
                      placement: "bottom",
                    },
                  },
                },
                {
                  labelKey: `some.scope.fields.unitPosition.label`,
                  scope: "/properties/_metrics/properties/unitPosition",
                  type: "Control",
                  options: {
                    control: "hub-field-input-select",
                    enum: {
                      i18nScope: `some.scope.fields.unitPosition.enum`,
                    },
                  },
                },
              ],
            },
            {
              type: "Section",
              labelKey: `some.scope.sections.appearance.label`,
              options: {
                section: "block",
                open: false,
              },
              elements: [
                {
                  labelKey: `some.scope.fields.trailingText.label`,
                  scope: "/properties/_metrics/properties/trailingText",
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
