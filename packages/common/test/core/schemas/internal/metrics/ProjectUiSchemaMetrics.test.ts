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
          labelKey: `some.scope.fields.cardTitle.label`,
          scope: "/properties/_metrics/properties/cardTitle",
          type: "Control",
        },
        {
          labelKey: `some.scope.fields.value.label`,
          scope: "/properties/_metrics/properties/value",
          type: "Control",
        },
        {
          labelKey: `some.scope.fields.units.label`,
          scope: "/properties/_metrics/properties/units",
          type: "Control",
          options: {
            helperText: {
              labelKey: `some.scope.fields.units.helperText`,
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
        {
          labelKey: `some.scope.fields.trailingText.label`,
          scope: "/properties/_metrics/properties/trailingText",
          type: "Control",
        },
      ],
    });
  });
});
