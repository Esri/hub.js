import { CardEditorOptions } from "../../../../../src/core/schemas/internal/EditorOptions";
import { buildUiSchema } from "../../../../../src/core/schemas/internal/follow/FollowUiSchema";
import { MOCK_CONTEXT } from "../../../../mocks/mock-auth";

describe("buildUiSchema: follow", () => {
  it("returns the full follow card uiSchema", async () => {
    const uiSchema = buildUiSchema("", {} as CardEditorOptions, MOCK_CONTEXT);
    expect(uiSchema.type).toBe("Layout");
    expect(uiSchema.elements?.length).toBe(7);
    // TODO: add more explicit tests when we polish the ui schema later
    // e.g. check the scopes, the controls
  });
});
