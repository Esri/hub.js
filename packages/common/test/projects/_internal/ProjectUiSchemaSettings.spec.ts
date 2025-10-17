import { buildUiSchema } from "../../../src/projects/_internal/ProjectUiSchemaSettings";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";

// ProjectUiSchemaSettings tests
describe("buildUiSchema: projects settings", () => {
  it("returns the full projeccts settings uiSchema", async () => {
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
