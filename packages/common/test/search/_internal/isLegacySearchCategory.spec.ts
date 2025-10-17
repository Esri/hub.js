import { isLegacySearchCategory } from "../../../src/search/_internal/commonHelpers/isLegacySearchCategory";

describe("isLegacySearchCategory", () => {
  it("returns true for all legacy search categories", () => {
    expect(isLegacySearchCategory("Site")).toBeTruthy();
    expect(isLegacySearchCategory("Event")).toBeTruthy();
    expect(isLegacySearchCategory("Dataset")).toBeTruthy();
    expect(isLegacySearchCategory("Document")).toBeTruthy();
    expect(isLegacySearchCategory("App,Map")).toBeTruthy();
  });

  it("returns false for other values", () => {
    expect(isLegacySearchCategory("dataset")).toBeFalsy();
  });
});
