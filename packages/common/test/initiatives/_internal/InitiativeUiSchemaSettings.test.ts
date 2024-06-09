import { buildUiSchema } from "../../../src/initiatives/_internal/InitiativeUiSchemaSettings";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";

describe("buildUiSchema: initiatives settings", () => {
  it("returns the full initiatives settings uiSchema", async () => {
    const uiSchema = await buildUiSchema("some.scope", {} as any, MOCK_CONTEXT);
    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Section",
          labelKey: "some.scope.sections.map.label",
          elements: [
            {
              type: "Control",
              scope: "/properties/view/properties/mapSettings",
              labelKey: "some.scope.fields.map.label",
              options: {
                type: "Control",
                control: "hub-field-input-map",
                // the settings that are visible for configuring the map
                visibleSettings: ["gallery"],
                // if the map preview is displayed
                showPreview: true,
              },
            },
          ],
        },
      ],
    });
  });
});
