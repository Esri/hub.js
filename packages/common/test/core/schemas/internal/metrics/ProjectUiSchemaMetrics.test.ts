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
          labelKey: `some.scope.uiSchema.flowTitle.sectionTitle`,
          options: {
            section: "block",
            helperText: `some.scope.uiSchema.flowTitle.description`,
          },
          elements: [
            {
              labelKey: `some.scope.uiSchema.cardTitle.title`,
              scope: "/properties/_metrics/cardTitle",
              type: "Control",
            },
            {
              labelKey: `some.scope.uiSchema.value.title`,
              scope: "/properties/_metrics/value",
              type: "Control",
            },
            {
              labelKey: `some.scope.uiSchema.units.title`,
              scope: "/properties/_metrics/units",
              type: "Control",
              options: {
                helperText: {
                  labelKey: `some.scope.uiSchema.units.helperText`,
                  placement: "bottom",
                },
              },
            },
            {
              labelKey: `some.scope.uiSchema.unitPosition.title`,
              scope: "/properties/_metrics/unitPosition",
              type: "Control",
              options: {
                control: "hub-field-input-select",
                enum: {
                  i18nScope: `some.scope.uiSchema.unitPosition.enum`,
                },
              },
            },
            {
              labelKey: `some.scope.uiSchema.trailingText.title`,
              scope: "/properties/_metrics/trailingText",
              type: "Control",
            },
          ],
        },
      ],
    });
  });
});
