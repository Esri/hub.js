import { transformFormValuesToEntityPermissionPolicies } from "../../../src/channels/_internal/transformFormValuesToEntityPermissionPolicies";
import {
  COLLABORATION_TYPES,
  IEntityPermissionPolicy,
} from "../../../src/permissions/types";
import { IHubRoleConfigValue } from "../../../src/channels/_internal/transformEntityPermissionPoliciesToFormValues";
import {
  CHANNEL_PERMISSIONS,
  ChannelNonePermission,
} from "../../../src/channels/_internal/ChannelBusinessRules";

describe("transformFormValuesToEntityPermissionPolicies", () => {
  it("should transform an array of IHubRoleConfig objects to an array of IEntityPermissionPolicy objects", () => {
    const roleConfigs: IHubRoleConfigValue[] = [
      {
        key: "public",
        entityId: null,
        entityType: null,
        roles: {
          anonymous: {
            value: CHANNEL_PERMISSIONS.channelRead,
            id: "11a",
          },
          authenticated: {
            value: CHANNEL_PERMISSIONS.channelWrite,
          },
        },
      },
      {
        key: "orgId123",
        entityId: "orgId123",
        entityType: "organization",
        roles: {
          member: {
            value: CHANNEL_PERMISSIONS.channelReadWrite,
            id: "11c",
          },
          admin: {
            value: CHANNEL_PERMISSIONS.channelOwner,
            id: "11d",
          },
        },
      },
      {
        key: "orgId456",
        entityId: "orgId456",
        entityType: "organization",
        roles: {
          member: {
            value: ChannelNonePermission,
            id: "11e",
          },
          admin: {
            value: ChannelNonePermission,
            id: "11f",
          },
        },
      },
      {
        key: "groupId123",
        entityId: "groupId123",
        entityType: "group",
        roles: {
          member: {
            value: CHANNEL_PERMISSIONS.channelReadWrite,
          },
          admin: {
            value: CHANNEL_PERMISSIONS.channelModerate,
            id: "11h",
          },
        },
      },
      {
        key: "groupId456",
        entityId: "groupId456",
        entityType: "group",
        roles: {
          member: {
            value: ChannelNonePermission,
          },
          admin: {
            value: ChannelNonePermission,
            id: "11j",
          },
        },
      },
      {
        key: "userId123",
        entityId: "userId123",
        entityType: "user",
        roles: {
          user: {
            value: CHANNEL_PERMISSIONS.channelRead,
            id: "11k",
          },
        },
      },
      {
        key: "userId123",
        entityId: "userId123",
        entityType: "event",
        roles: {
          user: {
            value: CHANNEL_PERMISSIONS.channelRead,
            id: "11k",
          },
        },
      },
    ];
    const expected: IEntityPermissionPolicy[] = [
      {
        permission: CHANNEL_PERMISSIONS.channelRead,
        collaborationType: COLLABORATION_TYPES.anonymous,
        collaborationId: null,
        id: "11a",
      },
      {
        permission: CHANNEL_PERMISSIONS.channelWrite,
        collaborationType: COLLABORATION_TYPES.authenticated,
        collaborationId: null,
        id: undefined,
      },
      {
        permission: CHANNEL_PERMISSIONS.channelReadWrite,
        collaborationType: COLLABORATION_TYPES.org,
        collaborationId: "orgId123",
        id: "11c",
      },
      {
        permission: CHANNEL_PERMISSIONS.channelOwner,
        collaborationType: COLLABORATION_TYPES.orgAdmin,
        collaborationId: "orgId123",
        id: "11d",
      },
      {
        permission: CHANNEL_PERMISSIONS.channelReadWrite,
        collaborationType: COLLABORATION_TYPES.group,
        collaborationId: "groupId123",
        id: undefined,
      },
      {
        permission: CHANNEL_PERMISSIONS.channelModerate,
        collaborationType: COLLABORATION_TYPES.groupAdmin,
        collaborationId: "groupId123",
        id: "11h",
      },
      {
        permission: CHANNEL_PERMISSIONS.channelRead,
        collaborationType: COLLABORATION_TYPES.user,
        collaborationId: "userId123",
        id: "11k",
      },
    ];
    const results = transformFormValuesToEntityPermissionPolicies(roleConfigs);
    expect(results).toEqual(expected);
  });
});
