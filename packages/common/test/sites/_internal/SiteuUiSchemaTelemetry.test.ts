import { buildUiSchema } from "../../../src/sites/_internal/SiteUiSchemaTelemetry";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";

describe("buildUiSchema: site telemetry", () => {
  it("returns the full site telemetry uiSchema", async () => {
    const uiSchema = await buildUiSchema("some.scope", {} as any, MOCK_CONTEXT);
    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Section",
          elements: [
            {
              scope: "/properties/telemetry/properties/consentNotice",
              type: "Control",
              options: {
                control: "arcgis-privacy-config",
              },
            },
          ],
        },
      ],
    });
  });
});
