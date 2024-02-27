import { UiSchemaRuleEffects } from "../../../src/core/schemas/types";
import { buildUiSchema } from "../../../src/surveys/_internal/SurveyUiSchemaSettings";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";

describe("buildUiSchema: survey settings", () => {
  it("returns the full survey settings uiSchema", async () => {
    const uiSchema = await buildUiSchema("some.scope", {} as any, MOCK_CONTEXT);
    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Section",
          rule: {
            effect: UiSchemaRuleEffects.SHOW,
            condition: {
              scope: "/properties/hasMapQuestion",
              schema: { const: true },
            },
          },
          labelKey: `some.scope.sections.settings.label`,
          elements: [
            {
              labelKey: `some.scope.fields.displayMap.label`,
              scope: "/properties/displayMap",
              type: "Control",
              options: {
                control: "hub-field-input-tile-select",
                type: "radio",
                layout: "horizontal",
                labels: [
                  `{{some.scope.fields.displayMap.enabled.label:translate}}`,
                  `{{some.scope.fields.displayMap.disabled.label:translate}}`,
                ],
                descriptions: [
                  `{{some.scope.fields.displayMap.enabled.description:translate}}`,
                  `{{some.scope.fields.displayMap.disabled.description:translate}}`,
                ],
                icons: ["sidecar", "form-elements"],
              },
            },
          ],
        },
      ],
    });
  });
});
