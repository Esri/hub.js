import { isPermission } from "../../../src";

describe("isPermission:", () => {
  it("returns true for valid permission", () => {
    expect(isPermission("hub:site:create")).toBe(true);
  });

  it("returns fails for invalid permission", () => {
    expect(isPermission("foo:site:create")).toBe(false);
  });
});
