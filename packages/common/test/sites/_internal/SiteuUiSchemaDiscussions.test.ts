import { buildUiSchema } from "../../../src/sites/_internal/SiteUiSchemaDiscussions";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";

describe("buildUiSchema: site discussions", () => {
  it("returns the full site discussions uiSchema", async () => {
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
              scope: "/properties/_discussions",
              type: "Control",
              options: {
                control: "hub-field-input-radio",
                labels: [
                  "{{some.scope.fields.discussable.enabled.label:translate}}",
                  "{{some.scope.fields.discussable.disabled.label:translate}}",
                ],
                descriptions: [
                  "{{some.scope.fields.discussable.enabled.description:translate}}",
                  "{{some.scope.fields.discussable.disabled.description:translate}}",
                ],
                icons: ["speech-bubbles", "circle-disallowed"],
              },
            },
          ],
        },
      ],
    });
  });
});
