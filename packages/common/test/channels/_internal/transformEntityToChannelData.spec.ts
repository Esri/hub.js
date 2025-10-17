import { describe, it, expect } from "vitest";
import { CHANNEL_PERMISSIONS } from "../../../src/channels/_internal/ChannelBusinessRules";
import { transformEntityToChannelData } from "../../../src/channels/_internal/transformEntityToChannelData";
import { IHubChannel } from "../../../src/core/types/IHubChannel";
import {
  AclCategory,
  AclSubCategory,
  ICreateChannelV2,
  Role,
} from "../../../src/discussions/api/types";
import { COLLABORATION_TYPES } from "../../../src/permissions/types/IEntityPermissionPolicy";

describe("transformEntityToChannelData", () => {
  it("should transform the given entity to a ICreateChannelV2", () => {
    const entity: IHubChannel = {
      name: "My channel",
      blockWords: ["baad"],
      allowAsAnonymous: true,
      permissions: [
        {
          collaborationType: COLLABORATION_TYPES.anonymous,
          collaborationId: null,
          id: "1aa",
          permission: CHANNEL_PERMISSIONS.channelRead,
        },
        {
          collaborationType: COLLABORATION_TYPES.authenticated,
          collaborationId: null,
          id: "2aa",
          permission: CHANNEL_PERMISSIONS.channelWrite,
        },
        {
          collaborationType: COLLABORATION_TYPES.org,
          collaborationId: "orgId1",
          id: "3aa",
          permission: CHANNEL_PERMISSIONS.channelReadWrite,
        },
        {
          collaborationType: COLLABORATION_TYPES.orgAdmin,
          collaborationId: "orgId1",
          id: "4aa",
          permission: CHANNEL_PERMISSIONS.channelManage,
        },
        {
          collaborationType: COLLABORATION_TYPES.group,
          collaborationId: "groupId1",
          id: "5aa",
          permission: CHANNEL_PERMISSIONS.channelReadWrite,
        },
        {
          collaborationType: COLLABORATION_TYPES.groupAdmin,
          collaborationId: "groupId1",
          id: "6aa",
          permission: CHANNEL_PERMISSIONS.channelModerate,
        },
        {
          collaborationType: "unsupported",
          collaborationId: "groupId1",
          id: "2bb",
          permission: CHANNEL_PERMISSIONS.channelOwner,
        },
      ],
    } as IHubChannel;
    const expected: ICreateChannelV2 = {
      name: "My channel",
      blockWords: ["baad"],
      allowAsAnonymous: true,
      channelAclDefinition: [
        {
          category: AclCategory.ANONYMOUS_USER,
          subCategory: null,
          key: null,
          role: Role.READ,
        },
        {
          category: AclCategory.AUTHENTICATED_USER,
          subCategory: null,
          key: null,
          role: Role.WRITE,
        },
        {
          category: AclCategory.ORG,
          subCategory: AclSubCategory.MEMBER,
          key: "orgId1",
          role: Role.READWRITE,
        },
        {
          category: AclCategory.ORG,
          subCategory: AclSubCategory.ADMIN,
          key: "orgId1",
          role: Role.MANAGE,
        },
        {
          category: AclCategory.GROUP,
          subCategory: AclSubCategory.MEMBER,
          key: "groupId1",
          role: Role.READWRITE,
        },
        {
          category: AclCategory.GROUP,
          subCategory: AclSubCategory.ADMIN,
          key: "groupId1",
          role: Role.MODERATE,
        },
      ],
    };
    const results = transformEntityToChannelData(entity);
    expect(results).toEqual(expected);
  });
});
