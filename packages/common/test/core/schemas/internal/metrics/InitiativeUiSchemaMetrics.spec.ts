import {
  buildDefaults,
  buildUiSchema,
} from "../../../../../src/core/schemas/internal/metrics/InitiativeUiSchemaMetrics";
import { MOCK_CONTEXT } from "../../../../mocks/mock-auth";
import { EntityEditorOptions } from "../../../../../src/core/schemas/internal/EditorOptions";

describe("InitiativeUiSchemaMetrics", () => {
  describe("buildUiSchema", () => {
    it("returns the full metrics uiSchema", async () => {
      const uiSchema = await buildUiSchema(
        "",
        {} as EntityEditorOptions,
        MOCK_CONTEXT
      );

      // rather than comparing the entire uiSchema structure (which
      // can be difficult to maintain over time), we simply validate
      // a minimal set of properties in the uiSchema
      expect(uiSchema.type).toBe("Layout");
      expect(uiSchema.elements?.length).toBe(4);
      expect(uiSchema.elements[1].type).toBe("Section");
      expect(uiSchema.elements[1].elements[0].scope).toBe(
        "/properties/_metric/properties/cardTitle"
      );
      expect(uiSchema.elements[2].elements[0].options.control).toBe(
        "hub-field-input-tile-select"
      );
    });
  });

  describe("buildDefaults", () => {
    it("returns the default values for the initiative metrics", async () => {
      const defaults = await buildDefaults(
        "some.scope",
        {} as EntityEditorOptions,
        MOCK_CONTEXT
      );

      expect(defaults).toEqual({
        _metric: {
          cardTitle: "{{shared.fields.metrics.cardTitle.label:translate}}",
        },
      });
    });
  });
});
