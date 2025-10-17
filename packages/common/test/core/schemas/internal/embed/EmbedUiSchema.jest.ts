import { buildUiSchema } from "../../../../../src/core/schemas/internal/embed/EmbedUiSchema";
import type { IArcGISContext } from "../../../../../src/types/IArcGISContext";

describe("EmbedUiSchema", () => {
  describe("buildUiSchema", () => {
    it("should return the expected uiSchema", () => {
      expect(buildUiSchema("", {}, {} as IArcGISContext)).toEqual({
        type: "Layout",
        elements: [
          {
            scope: "/properties/embeds",
            type: "Control",
            options: {
              control: "hub-composite-input-embeds",
            },
          },
        ],
      });
    });
  });
});
