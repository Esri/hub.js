import { buildUiSchema } from "../../../src/sites/_internal/SiteUiSchemaSettings";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";

describe("buildUiSchema: site settings", () => {
  it("returns the full site settings uiSchema", async () => {
    const i18nScope = "some.scope";
    const orgUrlKey = "my-org";
    const uiSchema = await buildUiSchema(
      i18nScope,
      { orgUrlKey } as any,
      MOCK_CONTEXT
    );
    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Section",
          labelKey: `${i18nScope}.sections.siteUrl.label`,
          elements: [
            {
              scope: "/properties/_urlInfo",
              type: "Control",
              options: {
                type: "Control",
                control: "hub-composite-input-site-url",
                orgUrlKey,
                messages: [
                  {
                    type: "ERROR",
                    keyword: "isUniqueDomain",
                    labelKey: `${i18nScope}.fields.siteUrl.isUniqueError`,
                    icon: true,
                  },
                ],
              },
            },
          ],
        },
        {
          type: "Section",
          labelKey: `${i18nScope}.sections.privacy.label`,
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
