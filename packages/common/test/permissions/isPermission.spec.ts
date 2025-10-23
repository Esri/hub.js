import { ValidPermissions } from "../../src/permissions/_internal/constants";
import { isPermission } from "../../src/permissions/isPermission";

describe("isPermission:", () => {
  ValidPermissions.forEach((permission) => {
    it(`returns true for ${permission} permission`, () => {
      expect(isPermission(permission)).toBe(true);
    });
  });

  it("returns false for invalid permission", () => {
    expect(isPermission("foo:site:create")).toBe(false);
  });
});
