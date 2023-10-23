import { buildUiSchema } from "../../../../../src/core/schemas/internal/metrics/MetricUiSchema";
import { MOCK_CONTEXT } from "../../../../mocks/mock-auth";

describe("buildUiSchema: metric", () => {
  it("returns the full metric uiSchema", () => {
    const uiSchema = buildUiSchema(
      "some.scope",
      { themeColors: ["#ffffff"] },
      MOCK_CONTEXT
    );

    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Section",
          labelKey: `some.scope.details.sectionTitle`,
          options: {
            section: "block",
          },
          elements: [
            {
              labelKey: `some.scope.details.title`,
              scope: "/properties/cardTitle",
              type: "Control",
            },
          ],
        },
      ],
    });
  });
});
