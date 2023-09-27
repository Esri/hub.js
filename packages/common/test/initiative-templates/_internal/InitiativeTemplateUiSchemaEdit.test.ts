import { buildUiSchema } from "../../../src/initiative-templates/_internal/InitiativeTemplateUiSchemaEdit";
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
        {
          type: "Control",
          scope: "/properties/previewUrl",
          labelKey: `some.scope.fields.previewUrl.label`,
        },
        {
          type: "Control",
          scope: "/properties/summary",
          labelKey: `some.scope.fields.summary.label`,
        },
        {
          type: "Control",
          scope: "/properties/description",
          labelKey: `some.scope.fields.description.label`,
        },
        {
          type: "Control",
          scope: "/properties/_thumbnail",
          labelKey: `some.scope.fields._thumbnail.label`,
        },
      ],
    });
  });
});
