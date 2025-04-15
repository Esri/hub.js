import { buildUiSchema } from "../../../src/discussions/_internal/DiscussionUiSchemaSettings";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";

describe("buildUiSchema: discussions settings", () => {
  it("returns the full discussions settings uiSchema", async () => {
    const uiSchema = await buildUiSchema("some.scope", {} as any, MOCK_CONTEXT);
    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Section",
          labelKey: "shared.sections.mapSettings.label",
          elements: [
            {
              type: "Control",
              scope: "/properties/view/properties/mapSettings",
              labelKey: "some.scope.fields.mapSettings.label",
              options: {
                type: "Control",
                control: "hub-composite-input-map-settings",
                visibleSettings: ["gallery"],
                showPreview: true,
              },
            },
          ],
        },
      ],
    });
  });
});
