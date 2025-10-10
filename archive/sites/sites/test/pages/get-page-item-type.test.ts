import { getPageItemType } from "../../src";

describe("getPageItemType", () => {
  it("returns correct item type", async () => {
    expect(getPageItemType(false)).toBe("Hub Page");
    expect(getPageItemType(true)).toBe("Site Page");
  });
});
