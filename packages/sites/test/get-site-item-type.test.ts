import { getSiteItemType } from "../src";

describe("getSiteItemType", () => {
  it("returns the correct item type in hub/portal", () => {
    expect(getSiteItemType(false)).toBe("Hub Site Application");
    expect(getSiteItemType(true)).toBe("Site Application");
  });
});
