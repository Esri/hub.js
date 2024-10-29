import { buildUiSchema } from "../../../src/content/_internal/ContentUiSchemaDiscussions";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";

describe("buildUiSchema: content discussions", () => {
  it("returns the full content discussions uiSchema", async () => {
    const uiSchema = await buildUiSchema("some.scope", {} as any, MOCK_CONTEXT);
    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Section",
          labelKey: "some.scope.sections.discussions.label",
          elements: [
            {
              labelKey: "some.scope.fields.discussable.label",
              scope: "/properties/isDiscussable",
              type: "Control",
              options: {
                control: "hub-field-input-tile-select",
                layout: "horizontal",
                labels: [
                  "{{some.scope.fields.discussable.enabled.label:translate}}",
                  "{{some.scope.fields.discussable.disabled.label:translate}}",
                ],
                descriptions: [
                  "{{some.scope.fields.discussable.enabled.description:translate}}",
                  "{{some.scope.fields.discussable.disabled.description:translate}}",
                ],
                icons: ["speech-bubbles", "circle-disallowed"],
                type: "radio",
                styles: { "max-width": "45rem" },
              },
            },
          ],
        },
      ],
    });
  });
});
