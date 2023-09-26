import { buildUiSchema } from "../../../src/initiativeTemplates/_internal/InitiativeTemplateUiSchemaEdit";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";
import { UiSchemaMessageTypes } from "../../../src/core/schemas/types";

describe("buildUiSchema: initiative template edit", () => {
  it("returns the full initiative template edit uiSchema", async () => {
    const uiSchema = await buildUiSchema(
      "some.scope",
      { thumbnailUrl: "https://some-thumbnail-url.com" } as any,
      MOCK_CONTEXT
    );
    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Control",
          scope: "/properties/name",
          labelKey: `some.scope.fields.name.label`,
          options: {
            messages: [
              {
                type: UiSchemaMessageTypes.error,
                keyword: "required",
                icon: true,
                labelKey: `some.scope.fields.name.requiredError`,
              },
            ],
          },
        },
      ],
    });
  });
});
