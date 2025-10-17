import { IWithPermissions } from "../../src/core/traits/IWithPermissions";
import { IEntityPermissionPolicy } from "../../src/permissions/types/IEntityPermissionPolicy";
import {
  addPermissionPolicy,
  removePermissionPolicy,
} from "../../src/permissions/utils";

describe("permssion utils:", () => {
  describe("addPermissionPolicy", () => {
    it("adds policy", () => {
      const policy: IEntityPermissionPolicy = {
        permission: "hub:project:create",
        collaborationId: "123",
        collaborationType: "group-admin",
      };
      const policies = addPermissionPolicy([], policy);
      expect(policies).toEqual([policy]);
    });

    it("adds policy if permissions is undefined", () => {
      const policy: IEntityPermissionPolicy = {
        permission: "hub:project:create",
        collaborationId: "123",
        collaborationType: "group-admin",
      };
      const container: IWithPermissions = {};
      const policies = addPermissionPolicy(container.permissions, policy);
      expect(policies).toEqual([policy]);
    });
  });

  describe("removePermissionPolicy", () => {
    it("removes policy", () => {
      const policy: IEntityPermissionPolicy = {
        permission: "hub:project:create",
        collaborationId: "123",
        collaborationType: "group-admin",
      };
      const policies = addPermissionPolicy([], policy);
      expect(policies).toEqual([policy]);
      const removed = removePermissionPolicy(
        policies,
        policy.permission,
        policy.collaborationId
      );
      expect(removed).toEqual([]);
    });
    it("works if permissions is undefined", () => {
      const policy: IEntityPermissionPolicy = {
        permission: "hub:project:create",
        collaborationId: "123",
        collaborationType: "group-admin",
      };
      const container: IWithPermissions = {};
      const policies = removePermissionPolicy(
        container.permissions,
        policy.permission,
        policy.collaborationId
      );
      expect(policies).toEqual([]);
    });
  });
});
