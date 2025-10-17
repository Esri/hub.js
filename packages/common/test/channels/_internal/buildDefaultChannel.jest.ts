import {
  AclCategory,
  AclSubCategory,
  Role,
} from "../../../src/discussions/api/types";
import { buildDefaultChannel } from "../../../src/channels/_internal/buildDefaultChannel";
import * as transformAclPermissionToEntityPermissionPolicyModule from "../../../src/channels/_internal/transformAclPermissionToEntityPermissionPolicy";
import { IEntityPermissionPolicy } from "../../../src/permissions/types/IEntityPermissionPolicy";

describe("buildDefaultChannel", () => {
  it("should build a partial IHubChannel object for the given orgId", () => {
    const entityPermissionPolicy: IEntityPermissionPolicy = {
      permission: "hub:channel:manage",
      collaborationType: "org-admin",
      collaborationId: "orgId1",
      id: "1aa",
    };
    const transformAclPermissionToEntityPermissionPolicySpy = jest
      .spyOn(
        transformAclPermissionToEntityPermissionPolicyModule,
        "transformAclPermissionToEntityPermissionPolicy"
      )
      .mockReturnValue(entityPermissionPolicy);
    const expected = {
      name: "",
      blockWords: [] as string[],
      allowAsAnonymous: false,
      permissions: [entityPermissionPolicy],
      canEdit: true,
      canDelete: true,
    };
    const result = buildDefaultChannel("orgId1");
    expect(result).toEqual(expected);
    expect(
      transformAclPermissionToEntityPermissionPolicySpy
    ).toHaveBeenCalledTimes(1);
    expect(
      transformAclPermissionToEntityPermissionPolicySpy
    ).toHaveBeenCalledWith({
      category: AclCategory.ORG,
      subCategory: AclSubCategory.ADMIN,
      role: Role.OWNER,
      key: "orgId1",
    });
  });
});
