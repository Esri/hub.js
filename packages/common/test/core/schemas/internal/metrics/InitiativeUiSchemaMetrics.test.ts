import { HubEntity } from "../../../../../src/core/types/HubEntity";
import { buildUiSchema } from "../../../../../src/core/schemas/internal/metrics/InitiativeUiSchemaMetrics";
import { MOCK_CONTEXT } from "../../../../mocks/mock-auth";

describe("InitiativeUiSchemaMetrics", () => {
  describe("buildUiSchema", () => {
    it("returns the full follow card uiSchema", async () => {
      const uiSchema = await buildUiSchema("", {} as HubEntity, MOCK_CONTEXT);

      // rather than comparing the entire uiSchema structure (which
      // can be difficult to maintain over time), we simply validate
      // a minimal set of properties in the uiSchema
      expect(uiSchema.type).toBe("Layout");
      expect(uiSchema.elements?.length).toBe(4);
      expect(uiSchema.elements![0].type).toBe("Section");
      expect(uiSchema.elements![0].elements![0].scope).toBe(
        "/properties/_metric/properties/cardTitle"
      );
      expect(uiSchema.elements![1].elements![0].options!.control).toBe(
        "hub-field-input-tile-select"
      );
    });
  });
});
