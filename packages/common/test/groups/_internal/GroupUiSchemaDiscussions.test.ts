import { buildUiSchema } from "../../../src/groups/_internal/GroupUiSchemaDiscussions";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";

describe("buildUiSchema: group discussions", () => {
  it("returns the full group create uiSchema", async () => {
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
