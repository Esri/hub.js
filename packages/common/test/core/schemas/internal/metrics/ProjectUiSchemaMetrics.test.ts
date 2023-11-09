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
          labelKey: `some.scope.metrics.cardTitle.title`,
          scope: "/properties/_metrics/properties/cardTitle",
          type: "Control",
        },
        {
          labelKey: `some.scope.metrics.value.title`,
          scope: "/properties/_metrics/properties/value",
          type: "Control",
        },
        {
          labelKey: `some.scope.metrics.units.title`,
          scope: "/properties/_metrics/properties/units",
          type: "Control",
          options: {
            helperText: {
              labelKey: `some.scope.metrics.units.helperText`,
              placement: "bottom",
            },
          },
        },
        {
          labelKey: `some.scope.metrics.unitPosition.title`,
          scope: "/properties/_metrics/properties/unitPosition",
          type: "Control",
          options: {
            control: "hub-field-input-select",
            enum: {
              i18nScope: `some.scope.metrics.unitPosition.enum`,
            },
          },
        },
        {
          labelKey: `some.scope.metrics.trailingText.title`,
          scope: "/properties/_metrics/properties/trailingText",
          type: "Control",
        },
      ],
    });
  });
});
