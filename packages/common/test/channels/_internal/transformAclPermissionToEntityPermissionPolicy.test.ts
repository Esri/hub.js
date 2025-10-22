import { IChannelAclPermission } from "../../../src/discussions/api/types";
import { transformAclPermissionToEntityPermissionPolicy } from "../../../src/channels/_internal/transformAclPermissionToEntityPermissionPolicy";
import {
  COLLABORATION_TYPES,
  IEntityPermissionPolicy,
} from "../../../src/permissions/types/IEntityPermissionPolicy";
import { CHANNEL_PERMISSIONS } from "../../../src/channels/_internal/ChannelBusinessRules";
import { AclCategory } from "../../../src/discussions/api/enums/aclCategory";
import { AclSubCategory } from "../../../src/discussions/api/enums/aclSubCategory";
import { Role } from "../../../src/discussions/api/enums/role";

describe("transformAclPermissionToEntityPermissionPolicy", () => {
  it("should transform a group member policy", () => {
    const aclPermission: Pick<
      IChannelAclPermission,
      "category" | "subCategory" | "role" | "key"
    > & { id?: string } = {
      category: AclCategory.GROUP,
      subCategory: AclSubCategory.MEMBER,
      role: Role.READ,
      key: "31c",
    };
    const expected: IEntityPermissionPolicy = {
      permission: CHANNEL_PERMISSIONS.channelRead,
      collaborationId: "31c",
      collaborationType: COLLABORATION_TYPES.group,
      id: null,
    };
    let results = transformAclPermissionToEntityPermissionPolicy(aclPermission);
    expect(results).toEqual(expected);
    results = transformAclPermissionToEntityPermissionPolicy({
      ...aclPermission,
      id: "52n",
    });
    expect(results).toEqual({ ...expected, id: "52n" });
  });
  it("should transform a group admin policy", () => {
    const aclPermission: Pick<
      IChannelAclPermission,
      "category" | "subCategory" | "role" | "key"
    > & { id?: string } = {
      category: AclCategory.GROUP,
      subCategory: AclSubCategory.ADMIN,
      role: Role.READWRITE,
      key: "31c",
    };
    const expected: IEntityPermissionPolicy = {
      permission: CHANNEL_PERMISSIONS.channelReadWrite,
      collaborationId: "31c",
      collaborationType: COLLABORATION_TYPES.groupAdmin,
      id: null,
    };
    let results = transformAclPermissionToEntityPermissionPolicy(aclPermission);
    expect(results).toEqual(expected);
    results = transformAclPermissionToEntityPermissionPolicy({
      ...aclPermission,
      id: "52n",
    });
    expect(results).toEqual({ ...expected, id: "52n" });
  });
  it("should transform an organization member policy", () => {
    const aclPermission: Pick<
      IChannelAclPermission,
      "category" | "subCategory" | "role" | "key"
    > & { id?: string } = {
      category: AclCategory.ORG,
      subCategory: AclSubCategory.MEMBER,
      role: Role.MODERATE,
      key: "31c",
    };
    const expected: IEntityPermissionPolicy = {
      permission: CHANNEL_PERMISSIONS.channelModerate,
      collaborationId: "31c",
      collaborationType: COLLABORATION_TYPES.org,
      id: null,
    };
    let results = transformAclPermissionToEntityPermissionPolicy(aclPermission);
    expect(results).toEqual(expected);
    results = transformAclPermissionToEntityPermissionPolicy({
      ...aclPermission,
      id: "52n",
    });
    expect(results).toEqual({ ...expected, id: "52n" });
  });
  it("should transform an organization admin policy", () => {
    const aclPermission: Pick<
      IChannelAclPermission,
      "category" | "subCategory" | "role" | "key"
    > & { id?: string } = {
      category: AclCategory.ORG,
      subCategory: AclSubCategory.ADMIN,
      role: Role.MANAGE,
      key: "31c",
    };
    const expected: IEntityPermissionPolicy = {
      permission: CHANNEL_PERMISSIONS.channelManage,
      collaborationId: "31c",
      collaborationType: COLLABORATION_TYPES.orgAdmin,
      id: null,
    };
    let results = transformAclPermissionToEntityPermissionPolicy(aclPermission);
    expect(results).toEqual(expected);
    results = transformAclPermissionToEntityPermissionPolicy({
      ...aclPermission,
      id: "52n",
    });
    expect(results).toEqual({ ...expected, id: "52n" });
  });
  it("should transform an anonymous policy", () => {
    const aclPermission: Pick<
      IChannelAclPermission,
      "category" | "subCategory" | "role" | "key"
    > & { id?: string } = {
      category: AclCategory.ANONYMOUS_USER,
      subCategory: null,
      role: Role.READ,
      key: null,
    };
    const expected: IEntityPermissionPolicy = {
      permission: CHANNEL_PERMISSIONS.channelRead,
      collaborationId: null,
      collaborationType: COLLABORATION_TYPES.anonymous,
      id: null,
    };
    let results = transformAclPermissionToEntityPermissionPolicy(aclPermission);
    expect(results).toEqual(expected);
    results = transformAclPermissionToEntityPermissionPolicy({
      ...aclPermission,
      id: "52n",
    });
    expect(results).toEqual({ ...expected, id: "52n" });
  });
  it("should transform an authenticated policy", () => {
    const aclPermission: Pick<
      IChannelAclPermission,
      "category" | "subCategory" | "role" | "key"
    > & { id?: string } = {
      category: AclCategory.AUTHENTICATED_USER,
      subCategory: null,
      role: Role.WRITE,
      key: null,
    };
    const expected: IEntityPermissionPolicy = {
      permission: CHANNEL_PERMISSIONS.channelWrite,
      collaborationId: null,
      collaborationType: COLLABORATION_TYPES.authenticated,
      id: null,
    };
    let results = transformAclPermissionToEntityPermissionPolicy(aclPermission);
    expect(results).toEqual(expected);
    results = transformAclPermissionToEntityPermissionPolicy({
      ...aclPermission,
      id: "52n",
    });
    expect(results).toEqual({ ...expected, id: "52n" });
  });
  it("should transform an owner user policy", () => {
    const aclPermission: Pick<
      IChannelAclPermission,
      "category" | "subCategory" | "role" | "key"
    > & { id?: string } = {
      category: AclCategory.USER,
      subCategory: null,
      role: Role.OWNER,
      key: null,
    };
    const expected: IEntityPermissionPolicy = {
      permission: CHANNEL_PERMISSIONS.channelOwner,
      collaborationId: null,
      collaborationType: COLLABORATION_TYPES.user,
      id: null,
    };
    let results = transformAclPermissionToEntityPermissionPolicy(aclPermission);
    expect(results).toEqual(expected);
    results = transformAclPermissionToEntityPermissionPolicy({
      ...aclPermission,
      id: "52n",
    });
    expect(results).toEqual({ ...expected, id: "52n" });
  });
  it("should transform an owner org policy", () => {
    const aclPermission: Pick<
      IChannelAclPermission,
      "category" | "subCategory" | "role" | "key"
    > & { id?: string } = {
      category: AclCategory.ORG,
      subCategory: AclSubCategory.MEMBER,
      role: Role.OWNER,
      key: "orgId1",
    };
    const expected: IEntityPermissionPolicy = {
      permission: CHANNEL_PERMISSIONS.channelOwner,
      collaborationId: "orgId1",
      collaborationType: COLLABORATION_TYPES.org,
      id: null,
    };
    let results = transformAclPermissionToEntityPermissionPolicy(aclPermission);
    expect(results).toEqual(expected);
    results = transformAclPermissionToEntityPermissionPolicy({
      ...aclPermission,
      id: "52n",
    });
    expect(results).toEqual({ ...expected, id: "52n" });
  });
  it("should transform an owner org admin policy", () => {
    const aclPermission: Pick<
      IChannelAclPermission,
      "category" | "subCategory" | "role" | "key"
    > & { id?: string } = {
      category: AclCategory.ORG,
      subCategory: AclSubCategory.ADMIN,
      role: Role.OWNER,
      key: "orgId1",
    };
    const expected: IEntityPermissionPolicy = {
      permission: CHANNEL_PERMISSIONS.channelOwner,
      collaborationId: "orgId1",
      collaborationType: COLLABORATION_TYPES.orgAdmin,
      id: null,
    };
    let results = transformAclPermissionToEntityPermissionPolicy(aclPermission);
    expect(results).toEqual(expected);
    results = transformAclPermissionToEntityPermissionPolicy({
      ...aclPermission,
      id: "52n",
    });
    expect(results).toEqual({ ...expected, id: "52n" });
  });
  it("should transform an owner group policy", () => {
    const aclPermission: Pick<
      IChannelAclPermission,
      "category" | "subCategory" | "role" | "key"
    > & { id?: string } = {
      category: AclCategory.GROUP,
      subCategory: AclSubCategory.MEMBER,
      role: Role.OWNER,
      key: "groupId1",
    };
    const expected: IEntityPermissionPolicy = {
      permission: CHANNEL_PERMISSIONS.channelOwner,
      collaborationId: "groupId1",
      collaborationType: COLLABORATION_TYPES.group,
      id: null,
    };
    let results = transformAclPermissionToEntityPermissionPolicy(aclPermission);
    expect(results).toEqual(expected);
    results = transformAclPermissionToEntityPermissionPolicy({
      ...aclPermission,
      id: "52n",
    });
    expect(results).toEqual({ ...expected, id: "52n" });
  });
  it("should transform an owner group admin policy", () => {
    const aclPermission: Pick<
      IChannelAclPermission,
      "category" | "subCategory" | "role" | "key"
    > & { id?: string } = {
      category: AclCategory.GROUP,
      subCategory: AclSubCategory.ADMIN,
      role: Role.OWNER,
      key: "groupId1",
    };
    const expected: IEntityPermissionPolicy = {
      permission: CHANNEL_PERMISSIONS.channelOwner,
      collaborationId: "groupId1",
      collaborationType: COLLABORATION_TYPES.groupAdmin,
      id: null,
    };
    let results = transformAclPermissionToEntityPermissionPolicy(aclPermission);
    expect(results).toEqual(expected);
    results = transformAclPermissionToEntityPermissionPolicy({
      ...aclPermission,
      id: "52n",
    });
    expect(results).toEqual({ ...expected, id: "52n" });
  });
  it("should transform a user policy", () => {
    const aclPermission: Pick<
      IChannelAclPermission,
      "category" | "subCategory" | "role" | "key"
    > & { id?: string } = {
      category: AclCategory.USER,
      subCategory: null,
      role: Role.READWRITE,
      key: "userId1",
    };
    const expected: IEntityPermissionPolicy = {
      permission: CHANNEL_PERMISSIONS.channelReadWrite,
      collaborationId: "userId1",
      collaborationType: COLLABORATION_TYPES.user,
      id: null,
    };
    let results = transformAclPermissionToEntityPermissionPolicy(aclPermission);
    expect(results).toEqual(expected);
    results = transformAclPermissionToEntityPermissionPolicy({
      ...aclPermission,
      id: "52n",
    });
    expect(results).toEqual({ ...expected, id: "52n" });
  });
});
