import { buildUiSchema } from "../../../src/discussions/_internal/DiscussionUiSchemaCreate";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";

describe("buildUiSchema: discussion create", () => {
  it("returns the full discussion create uiSchema", async () => {
    const uiSchema = await buildUiSchema("some.scope", {} as any, MOCK_CONTEXT);
    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          labelKey: "some.scope.fields.name.label",
          scope: "/properties/name",
          type: "Control",
          options: {
            messages: [
              {
                type: "ERROR",
                keyword: "required",
                icon: true,
                labelKey: "some.scope.fields.name.requiredError",
              },
              {
                type: "ERROR",
                keyword: "maxLength",
                icon: true,
                labelKey: `shared.fields.title.maxLengthError`,
              },
            ],
          },
        },
        {
          labelKey: "some.scope.fields.prompt.label",
          scope: "/properties/prompt",
          type: "Control",
          options: {
            helperText: {
              labelKey: "some.scope.fields.prompt.helperText",
            },
            messages: [
              {
                type: "ERROR",
                keyword: "required",
                icon: true,
                labelKey: "some.scope.fields.prompt.requiredError",
              },
            ],
          },
        },
      ],
    });
  });
});
