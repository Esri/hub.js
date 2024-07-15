import { buildUiSchema } from "../../../src/initiatives/_internal/InitiativeUiSchemaCreate2";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";

describe("buildUiSchema: initiative create", () => {
  it("returns the full initiative create uiSchema", async () => {
    const uiSchema = await buildUiSchema("some.scope", {} as any, MOCK_CONTEXT);
    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          labelKey: `some.scope.fields.name.label`,
          scope: "/properties/name",
          type: "Control",
          options: {
            messages: [
              {
                type: "ERROR",
                keyword: "required",
                icon: true,
                labelKey: `some.scope.fields.name.requiredError`,
              },
              {
                type: "ERROR",
                keyword: "maxLength",
                icon: true,
                labelKey: `some.scope.fields.name.maxLengthError`,
              },
            ],
          },
        },
      ],
    });
  });
});
