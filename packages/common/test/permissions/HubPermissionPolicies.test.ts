import { getPermissionPolicy, Permission } from "../../src";

describe("HubPermissionPolicies:", () => {
  it("returns true for valid permission policy", () => {
    expect(getPermissionPolicy("hub:project:create")).toBeTruthy();
  });

  it("returns false for invalid permission policy", () => {
    expect(getPermissionPolicy("WAT" as Permission)).toBeFalsy();
  });
});
