import { CardEditorOptions } from "../../../../../src/core/schemas/internal/EditorOptions";
import { buildUiSchema } from "../../../../../src/core/schemas/internal/follow/FollowCardUiSchema";
import { MOCK_CONTEXT } from "../../../../mocks/mock-auth";

// Instead of doing a full object comparison, we are checking the
// elements existance and more specific comparisons. so when a small
// change is made, it's easy to detect the failing tests and the
// reason why they are failing

describe("buildUiSchema: follow", () => {
  it("returns the correct follow card uiSchema", async () => {
    const uiSchema = await buildUiSchema(
      "",
      {} as CardEditorOptions,
      MOCK_CONTEXT
    );

    expect(uiSchema.type).toBe("Layout");
    expect(uiSchema.elements?.length).toBe(3);
    expect(uiSchema.elements![0].scope).toBe("/properties/entityId");
    expect(uiSchema.elements![0].options!.control).toBe(
      "hub-field-input-gallery-picker"
    );

    expect(uiSchema.elements![1].elements?.length).toBe(2);
    expect(uiSchema.elements![1].elements?.[0].scope).toBe(
      "/properties/callToActionText"
    );
    expect(uiSchema.elements![1].elements?.[0].options?.type).toBe("textarea");
    expect(uiSchema.elements![1].elements?.[1].scope).toBe(
      "/properties/callToActionAlign"
    );
    expect(uiSchema.elements![1].elements?.[1].options?.control).toBe(
      "hub-field-input-alignment"
    );

    expect(uiSchema.elements![2].elements?.length).toBe(4);
    expect(uiSchema.elements![2].elements?.[0].scope).toBe(
      "/properties/buttonText"
    );
    expect(uiSchema.elements![2].elements?.[0].options?.control).toBe(
      "hub-field-input-input"
    );
    expect(uiSchema.elements![2].elements?.[1].scope).toBe(
      "/properties/unfollowButtonText"
    );
    expect(uiSchema.elements![2].elements?.[1].options?.control).toBe(
      "hub-field-input-input"
    );
    expect(uiSchema.elements![2].elements?.[2].scope).toBe(
      "/properties/buttonAlign"
    );
    expect(uiSchema.elements![2].elements?.[2].options?.control).toBe(
      "hub-field-input-alignment"
    );
    expect(uiSchema.elements![2].elements?.[3].scope).toBe(
      "/properties/buttonStyle"
    );
    expect(uiSchema.elements![2].elements?.[3].options?.control).toBe(
      "hub-field-input-select"
    );
  });
});
