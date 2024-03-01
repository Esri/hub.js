import { hasMapQuestion } from "../../../src";
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
          labelKey: "some.scope.sections.settings.label",
          elements: [
            {
              labelKey: "some.scope.fields.displayMap.label",
              scope: "/properties/displayMap",
              type: "Control",
              rule: {
                effect: UiSchemaRuleEffects.DISABLE,
                condition: {
                  scope: "/properties/hasMapQuestion",
                  schema: {
                    const: false,
                  },
                },
              },
              options: {
                control: "hub-field-input-tile-select",
                type: "radio",
                labels: [
                  "{{some.scope.fields.displayMap.enabled.label:translate}}",
                  "{{some.scope.fields.displayMap.disabled.label:translate}}",
                ],
                descriptions: [
                  "{{some.scope.fields.displayMap.enabled.description:translate}}",
                  "{{some.scope.fields.displayMap.disabled.description:translate}}",
                ],
                icons: ["sidecar", "form-elements"],
                layout: "horizontal",
                messages: [
                  {
                    type: "CUSTOM",
                    display: "notice",
                    keyword: "mapQuestion",
                    titleKey: "some.scope.fields.displayMap.notice.title",
                    labelKey: "some.scope.fields.displayMap.notice.message",
                    allowShowBeforeInteract: true,
                    alwaysShow: true,
                  },
                ],
              },
            },
          ],
        },
      ],
    });
  });

  it("does not display notice if hasMapQuestion is true", async () => {
    const uiSchema = await buildUiSchema(
      "some.scope",
      { hasMapQuestion: true } as any,
      MOCK_CONTEXT
    );
    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Section",
          labelKey: "some.scope.sections.settings.label",
          elements: [
            {
              labelKey: "some.scope.fields.displayMap.label",
              scope: "/properties/displayMap",
              type: "Control",
              rule: {
                effect: UiSchemaRuleEffects.DISABLE,
                condition: {
                  scope: "/properties/hasMapQuestion",
                  schema: {
                    const: false,
                  },
                },
              },
              options: {
                control: "hub-field-input-tile-select",
                type: "radio",
                labels: [
                  "{{some.scope.fields.displayMap.enabled.label:translate}}",
                  "{{some.scope.fields.displayMap.disabled.label:translate}}",
                ],
                descriptions: [
                  "{{some.scope.fields.displayMap.enabled.description:translate}}",
                  "{{some.scope.fields.displayMap.disabled.description:translate}}",
                ],
                icons: ["sidecar", "form-elements"],
                layout: "horizontal",
                messages: [],
              },
            },
          ],
        },
      ],
    });
  });
});
