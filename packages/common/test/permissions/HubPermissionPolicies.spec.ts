import {
  getPermissionPolicy,
  HubPermissionsPolicies,
} from "../../src/permissions/HubPermissionPolicies";
import { isPermission } from "../../src/permissions/isPermission";
import { Permission } from "../../src/permissions/types/Permission";
import { describe, it, expect } from "vitest";

describe("HubPermissionPolicies:", () => {
  it("returns true for valid permission policy", () => {
    expect(getPermissionPolicy("hub:project:create")).toBeTruthy();
  });

  it("returns false for invalid permission policy", () => {
    expect(getPermissionPolicy("WAT" as Permission)).toBeFalsy();
  });

  it("verifies all HubPermissionPolicies are valid permissions", () => {
    HubPermissionsPolicies.forEach((policy) => {
      expect(isPermission(policy.permission)).toBeTruthy();
    });
  });
});
