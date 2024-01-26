import { CardEditorOptions } from "../../../../../src/core/schemas/internal/EditorOptions";
import { buildUiSchema } from "../../../../../src/core/schemas/internal/follow/FollowCardUiSchema";
import { MOCK_CONTEXT } from "../../../../mocks/mock-auth";

describe("buildUiSchema: follow", () => {
  it("returns the full follow card uiSchema", async () => {
    const uiSchema = buildUiSchema("", {} as CardEditorOptions, MOCK_CONTEXT);

    expect(uiSchema.type).toBe("Layout");
    expect(uiSchema.elements?.length).toBe(7);
    expect(uiSchema.elements![0].scope).toBe("/properties/followedItemId");
    expect(uiSchema.elements![0].options!.control).toBe(
      "hub-field-input-gallery-picker"
    );
    // TODO: add more explicit tests when we complete the ui schema
  });
});
